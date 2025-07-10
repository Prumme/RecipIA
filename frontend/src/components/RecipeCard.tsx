import Link from "next/link";
import { Users, Clock, ChefHat, Tags, ArrowRight } from "lucide-react";
import { Recipe } from "@/types/recipe.types";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export default function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <div className="w-full border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="py-4">
        <div className={className}>
          {/* Name & Type */}
          <div>
            <h2 className="font-medium">{recipe.Name}</h2>
            <span className="text-sm text-gray-500">{recipe.DishType}</span>
          </div>

          {/* Numbers of person */}
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <span>{recipe.Servings}</span>
          </div>

          {/* Preparation Time */}
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <span>{recipe.PrepTime} min</span>
          </div>

          {/* Difficulty */}
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs uppercase font-semibold ${
                recipe.Difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : recipe.Difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {recipe.Difficulty}
            </span>
          </div>

          {/* Tags & Link */}
          <div className="flex items-center justify-between font-semibold">
            <div className="flex gap-1">
              <Tags size={18} className="text-gray-400" />
              {recipe.Tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/recipe/${recipe.Slug}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm ml-4 group"
            >
              <ArrowRight
                className="inline ml-1 group-hover:translate-x-1 transition-all"
                size={16}
              />
            </Link>
          </div>
        </div>

        {/* Intolerances */}
        {recipe.Intolerances.length > 0 && (
          <div className="mt-2 px-6 flex gap-2 items-center">
            <span className="text-xs text-gray-500">Intolérances:</span>
            <div className="flex gap-1">
              {recipe.Intolerances.map((intolerance, index) => (
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
