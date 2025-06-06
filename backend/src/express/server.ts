import express from "express";
import bcrypt from "bcrypt";
import { makeController } from "./Controller";
import { loginRequest } from "./requests/loginRequest";
import { registerRequest } from "./requests/registerRequest";
import { ingredientRequest } from "./requests/ingredientRequest";
import { postRecipeRequest } from "./requests/postRecipeRequest";
import { updateRecipePrivacyRequest } from "./requests/updateRecipePrivacyRequest";
import { searchRequest } from "./requests/searchRequest";
import Airtable from "airtable";
import session from "express-session";
//@ts-ignore
import fileStore from "session-file-store";
import { AirtableUserRepository } from "../airtable/AirtableUserRepository";
import { AirtableIngredientRepository } from "../airtable/AirtableIngredientRepository";
import { AirtableRecipeRepository } from "../airtable/AirtableRecipeRepository";
import { AirtableRecipesListingRepository } from "../airtable/AirtableRecipesListingRepository";
import { Ingredient } from "../entities/Ingredient";
import { Recipe, FieldToCreateRecipe } from "../entities/Recipe";
import { hidePassword, User } from "../entities/User";
import { PaginatedCollection } from "../types/PaginatedCollection";
import { AirtableResult } from "../airtable/AirtableResult";
import cors from "cors";
import { paginatedRequest } from "./requests/paginatedRequest";
import { forceCacheRequest } from "./requests/forceCacheRequest";
import { EventObserver } from "../events/EventObserver";
import { isAuth } from "./utils/isAuth";
import { ClearCacheEvent } from "../events/ClearCacheEvent";

declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const secret = process.env.APP_SECRET || "secret";

if (!apiKey || !baseId)
  throw new Error(
    "Missing Airtable API Key or Base ID. Please set the environment variables AIRTABLE_API_KEY and AIRTABLE_BASE_ID."
  );

export const app = express();
const base = new Airtable({ apiKey }).base(baseId);
const userRepository = new AirtableUserRepository(base);
const ingredientRepository = new AirtableIngredientRepository(base);
const recipeRepository = new AirtableRecipeRepository(base);
const recipeListingRepository = new AirtableRecipesListingRepository(base);

/**
 * --- MIDLEWARES ---
 */

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
      const user = req.session.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      res.json(hidePassword(user));
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "An error occurred during login" });
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
        return res.status(401).json({ message: "Invalid credentials" });

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.user = user;
      res.json(hidePassword(user));
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

      // Set the session
      req.session.user = newUser;

      // Return the user without password
      res.status(201).json(hidePassword(newUser));
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
