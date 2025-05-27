import Link from "next/link";
import { Users, Clock, ChefHat, Tags } from "lucide-react";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type DishType = "MainDish" | "Appetizer" | "Dessert";
export type Tag = "vegetarian" | "Budget" | "Healthy";

export interface Recipe {
  name: string;
  servings: number;
  dishType: DishType;
  ingredients: string[];
  intolerances: string[];
  preparationTime: number;
  difficulty: Difficulty;
  tags: Tag[];
  slug: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export default function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <div className="w-full border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="py-4">
        {/* Grille principale */}
        <div className={className}>
          {/* Nom et type */}
          <div>
            <h2 className="font-medium">{recipe.name}</h2>
            <span className="text-sm text-gray-500">{recipe.dishType}</span>
          </div>

          {/* Nombre de personnes */}
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <span>{recipe.servings}</span>
          </div>

          {/* Temps de préparation */}
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <span>{recipe.preparationTime} min</span>
          </div>

          {/* Ingrédients */}
          <div className="flex items-center gap-2">
            <ChefHat size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {recipe.ingredients.length} ingrédients
            </span>
          </div>

          {/* Difficulté */}
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                recipe.difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : recipe.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>

          {/* Tags et lien */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Tags size={18} className="text-gray-400" />
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/recipe/${recipe.slug}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm ml-4"
            >
              Voir →
            </Link>
          </div>
        </div>

        {/* Intolérances (si présentes) */}
        {recipe.intolerances.length > 0 && (
          <div className="mt-2 px-6 flex gap-2 items-center">
            <span className="text-xs text-gray-500">Intolérances:</span>
            <div className="flex gap-1">
              {recipe.intolerances.map((intolerance, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs"
                >
                  {intolerance}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
