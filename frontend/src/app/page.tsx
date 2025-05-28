import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/components/RecipeCard";
import {
  Users,
  Clock,
  ChefHat,
  Tags,
  Sparkles,
  Bot,
  Shuffle,
} from "lucide-react";

const mockRecipes: Recipe[] = [
  {
    name: "Ratatouille Provençale",
    servings: 4,
    dishType: "MainDish",
    ingredients: [
      "Aubergine",
      "Courgette",
      "Poivron",
      "Tomate",
      "Oignon",
      "Ail",
      "Huile d'olive",
    ],
    intolerances: [],
    preparationTime: 45,
    difficulty: "Medium",
    tags: ["vegetarian", "Healthy"],
    slug: "ratatouille-provencale",
  },
  {
    name: "Tarte aux Pommes",
    servings: 8,
    dishType: "Dessert",
    ingredients: ["Pommes", "Pâte feuilletée", "Sucre", "Cannelle", "Beurre"],
    intolerances: ["Gluten", "Lactose"],
    preparationTime: 60,
    difficulty: "Easy",
    tags: ["Budget"],
    slug: "tarte-aux-pommes",
  },
  {
    name: "Velouté de Potiron",
    servings: 6,
    dishType: "Appetizer",
    ingredients: ["Potiron", "Oignon", "Crème", "Bouillon de légumes"],
    intolerances: ["Lactose"],
    preparationTime: 30,
    difficulty: "Easy",
    tags: ["vegetarian", "Healthy"],
    slug: "veloute-de-potiron",
  },
] as const;

const gridClassName =
  "grid grid-cols-[2fr_100px_100px_150px_120px_1fr] gap-4 items-center px-6";

export default function Home() {
  return (
    <div className="min-h-screen px-4 pt-16">
      <header className="mb-8 py-8 max-w-[90%] mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="text-primary" size={28} />
          <Sparkles className="text-primary" size={28} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Our Recipes</h1>
        <div className="max-w-2xl space-y-4">
          <p className="text-gray-600">
            Discover our curated collection of delicious recipes, powered by AI
            technology
          </p>
          <p className="text-gray-600">
            Your favorite platform for AI-generated recipes. Whether you're a
            seasoned chef or a cooking enthusiast, let our intelligent system
            inspire your next culinary masterpiece.
          </p>
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            <Shuffle size={20} />
            Get Random Recipe
          </button>
        </div>
      </header>

      <main className="max-w-[90%] mx-auto">
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          {/* Header de la table */}
          <div
            className={`${gridClassName} py-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-500`}
          >
            <div>Nom</div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Pers.</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Temps</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat size={16} />
              <span>Ingrédients</span>
            </div>
            <div>Difficulté</div>
            <div className="flex items-center gap-2">
              <Tags size={16} />
              <span>Tags</span>
            </div>
          </div>

          {/* Corps de la table */}
          {mockRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} className={gridClassName} />
          ))}
        </div>
      </main>
    </div>
  );
}
