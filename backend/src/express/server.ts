import express from "express";
import bcrypt from "bcrypt";
import { makeController } from "./Controller";
import { loginRequest } from "./requests/loginRequest";
import { registerRequest } from "./requests/registerRequest";
import { ingredientRequest } from "./requests/ingredientRequest";
import { postRecipeRequest } from "./requests/postRecipeRequest";
import { updateRecipePrivacyRequest } from "./requests/updateRecipePrivacyRequest";
import { searchRequest } from "./requests/searchRequest";
import { compositionRequest } from "./requests/compositionRequest";
import Airtable from "airtable";
import session from "express-session";
import { GeminiProvider } from "../ai/providers/GeminiProvider";
import { RecipeGenerationService } from "../services/RecipeGenerationService";
import { generateRecipeRequest } from "./requests/generateRecipeRequest";
import { AIRecipeService } from "../ai/services/AIRecipeService";
import { BraveImageSearchService } from "../services/BraveImageSearchService";
//@ts-ignore
import fileStore from "session-file-store";
import { AirtableUserRepository } from "../airtable/AirtableUserRepository";
import { AirtableIngredientRepository } from "../airtable/AirtableIngredientRepository";
import { AirtableRecipeRepository } from "../airtable/AirtableRecipeRepository";
import { AirtableRecipesListingRepository } from "../airtable/AirtableRecipesListingRepository";
import { AirtableCompositionRepository } from "../airtable/AirtableCompositionRepository";
import { Composition, FieldToCreateComposition } from "../entities/Composition";
import { Ingredient } from "../entities/Ingredient";
import { Recipe, FieldToCreateRecipe } from "../entities/Recipe";
import { hidePassword, User } from "../entities/User";
import { PaginatedCollection } from "../types/PaginatedCollection";
import { AirtableResult } from "../airtable/AirtableResult";
import cors from "cors";
import { paginatedRequest } from "./requests/paginatedRequest";
import { forceCacheRequest } from "./requests/forceCacheRequest";
import { EventObserver } from "../events/EventObserver";
import { isAuth, getUserFromToken } from "./utils/isAuth";
import { ClearCacheEvent } from "../events/ClearCacheEvent";
import { generateToken } from "./utils/jwt";

declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const secret = process.env.APP_SECRET || "secret";
const geminiApiKey = process.env.GEMINI_API_KEY;
const braveSearchApiKey = process.env.BRAVE_SEARCH_API_KEY;

if (!apiKey || !baseId || !geminiApiKey || !braveSearchApiKey)
  throw new Error(
    "Missing Airtable API Key or Base ID or Gemini API Key or Brave Search API Key. Please set the environment variables AIRTABLE_API_KEY and AIRTABLE_BASE_ID and GEMINI_API_KEY and BRAVE_SEARCH_API_KEY."
  );

export const app = express();
const base = new Airtable({ apiKey }).base(baseId);
const userRepository = new AirtableUserRepository(base);
const ingredientRepository = new AirtableIngredientRepository(base);
const recipeRepository = new AirtableRecipeRepository(base);
const recipeListingRepository = new AirtableRecipesListingRepository(base);
const compositionRepository = new AirtableCompositionRepository(base);

const geminiProvider = new GeminiProvider(geminiApiKey);
const aiRecipeService = new AIRecipeService(geminiProvider);
const braveGenerationService = new BraveImageSearchService(braveSearchApiKey);
const recipeGenerationService = new RecipeGenerationService(
  aiRecipeService,
  recipeRepository,
  ingredientRepository,
  compositionRepository,
  userRepository,
  braveGenerationService
);

/**
 * --- MIDLEWARES ---
 */

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/**
 * Represents a file-based session storage system for managing user sessions.
 * Use for the like system and the authentification
 */
const FileStore = fileStore(session);
app.use(
  session({
    store: new FileStore({
      path: "./sessions",
      retries: 0,
    }),
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (isAuth(req)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Authentication route
app.get(
  "/user",
  authMiddleware,
  makeController(async (req, res) => {
    try {
      const tokenPayload = getUserFromToken(req);
      if (!tokenPayload)
        return res.status(401).json({ message: "Unauthorized" });

      // Récupérer l'utilisateur depuis la base de données avec les informations du token
      const user = await userRepository.findByEmail({
        email: tokenPayload.email,
      });
      if (!user) return res.status(401).json({ message: "User not found" });

      res.json(hidePassword(user));
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "An error occurred during authentication" });
    }
  })
);

app.post(
  "/login",
  makeController(async (req, res) => {
    try {
      const { password, email } = req.payload;
      const user = await userRepository.findByEmail({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials (email)" });

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid credentials (password)" });
      }

      const token = generateToken(user);
      res.json({ user: hidePassword(user), token });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "An error occurred during login" });
    }
  }, loginRequest)
);

app.post(
  "/register",
  makeController(async (req, res) => {
    try {
      const { username, email, password } = req.payload;

      // Check if user already exists
      const existingEmail = await userRepository.findByEmail({ email });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const existingUsername = await userRepository.findByUsername({
        username,
      });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const newUser = await userRepository.create({
        Username: username,
        Email: email,
        Password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(newUser);

      // Return the user without password and token
      res.status(201).json({ user: hidePassword(newUser), token });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "An error occurred during registration" });
    }
  }, registerRequest)
);

app.post(
  "/reset-cache",
  authMiddleware,
  makeController(async (req, res) => {
    EventObserver.getInstance().emit(ClearCacheEvent);

    res.json({
      message: "Cache cleared",
    });
  })
);

// Ingredients routes
app.get(
  "/ingredients/:name",
  makeController(async (req, res) => {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: "Name parameter is required" });
    }

    try {
      const ingredient = await ingredientRepository.findByName({ name });
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      console.error("Error finding ingredient by name:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

app.post(
  "/ingredients",
  makeController(async (req, res) => {
    const ingredient: Ingredient = {
      ...req.payload,
      Intolerances: req.payload.Intolerances || [],
    };
    if (!ingredient || !ingredient.Name) {
      return res.status(400).json({ message: "Invalid ingredient data" });
    }

    try {
      const createdIngredient = await ingredientRepository.create(ingredient);
      res.status(201).json(createdIngredient);
    } catch (error) {
      console.error("Error creating ingredient:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }, ingredientRequest)
);

// Recipes routes
app.get(
  "/recipes",
  makeController(async (req, res) => {
    try {
      const { page, pageSize, cache, s: search } = req.payload;
      const recipes = await recipeListingRepository.findAll({
        page,
        pageSize,
        search,
        cache: Boolean(cache),
      });
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }, forceCacheRequest.merge(paginatedRequest.merge(searchRequest)))
);

app.get(
  "/recipes/author/:authorUsername",
  makeController(async (req, res) => {
    const { authorUsername } = req.params;
    if (!authorUsername) {
      return res.status(400).json({ message: "Author username is required" });
    }
    try {
      const { page, pageSize, cache, s: search } = req.payload;
      const recipes = await recipeListingRepository.findByAuthor({
        authorUsername: authorUsername,
        page,
        pageSize,
        search,
        cache: Boolean(cache),
      });
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes by author:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }, forceCacheRequest.merge(paginatedRequest.merge(searchRequest)))
);

app.get(
  "/recipes/:slug",
  makeController(async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: "Slug parameter is required" });
    }
    try {
      const recipe = await recipeRepository.findBySlug({ slug, cache: true });
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error finding recipe by slug:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

app.post(
  "/recipes",
  makeController(async (req, res) => {
    try {
      const recipe: FieldToCreateRecipe = {
        ...req.payload,
      };
      const createdRecipe = await recipeRepository.create(recipe);
      res.status(201).json(createdRecipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }, postRecipeRequest)
);

app.put(
  "/recipes/:slug/privacy",
  makeController(async (req, res) => {
    try {
      const { slug } = req.params;
      const { private: isPrivate } = req.body;

      if (typeof isPrivate !== "boolean") {
        return res
          .status(400)
          .json({ message: "Private field must be a boolean" });
      }

      const updatedRecipe = await recipeRepository.updateRecipePrivacy({
        slug,
        private: isPrivate,
      });

      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.json(updatedRecipe);
    } catch (error) {
      console.error("Error updating recipe privacy:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }, updateRecipePrivacyRequest)
);

// Compositions routes
app.post(
  "/compositions",
  makeController(async (req, res) => {
    const composition: FieldToCreateComposition = {
      ...req.payload,
    };
    if (!composition || !composition.Recipe) {
      return res.status(400).json({ message: "Invalid composition data" });
    }

    try {
      const createdComposition = await compositionRepository.create(
        composition
      );
      res.status(201).json(createdComposition);
    } catch (error) {
      console.error("Error creating composition:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }, compositionRequest)
);

// IA Recipe Generation route
app.post(
  "/generate-recipe",
  authMiddleware,
  makeController(async (req, res) => {
    try {
      const tokenPayload = getUserFromToken(req);
      if (!tokenPayload)
        return res.status(401).json({ message: "Unauthorized" });

      const recipe = await recipeGenerationService.generateAndSaveRecipe(
        req.payload,
        tokenPayload.username
      );

      res.status(201).json(recipe);
      EventObserver.getInstance().emit(ClearCacheEvent);
    } catch (error) {
      console.error("Error generating recipe:", error);
      res.status(500).json({
        message: "An error occurred during recipe generation",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, generateRecipeRequest)
);
