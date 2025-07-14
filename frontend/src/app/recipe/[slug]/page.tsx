"use client";

import React, { useEffect, useState, use } from "react";
import IngredientsList from "@/components/IngredientsList";
import { Clock, Users, ChefHat, Tag, AlertCircle } from "lucide-react";
import { API_URL } from "@/core/constant";
import { Ingredient, Recipe } from "@/types/recipe.types";
import Instructions from "@/components/Instructions";
import NutritionSummary from "@/components/NutritionSummary";
import NutritionDetails from "@/components/NutritionDetails";

// This mighty function shall later be replaced by a true API summoner

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function RecipePage({ params }: PageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { slug } = use(params);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`${API_URL}recipes/${slug}`);
      const data = await response.json();
      setRecipe(data);
    };
    fetchRecipe();
  }, [slug]);

  const createIngredients = (ingredients: Ingredient[]) => {
    const ingredientsList: Ingredient[] = [];
    for (let i = 0; i < ingredients.length; i++) {
      ingredientsList.push({
        IngredientsName: recipe?.IngredientsName[i] || "",
        IngredientsQuantity: recipe?.IngredientsQuantity[i] || "",
        IngredientsUnit: recipe?.IngredientsUnit[i] || "",
        IngredientsImages: recipe?.IngredientsImages[i] || { url: "" },
      });
    }

    return ingredientsList;
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Honorable Recipe Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-6">{recipe?.Name}</h1>

          {/* Magnificent Tags & Warnings */}
          <div className="flex flex-wrap gap-4 mb-6">
            {recipe && recipe.Tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={18} className="text-blue-600" />
                {recipe.Tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {recipe && recipe.Intolerances?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" />
                {recipe.Intolerances.map((warning, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium"
                  >
                    {warning}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recipe Stats: Feed the people! */}
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{recipe?.Servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{recipe?.PrepTime} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat size={20} />
              <span>Skill level: {recipe?.Difficulty}</span>
            </div>
          </div>
        </header>

        

        {/* The Mighty Grid of Culinary Knowledge */}
        <div className="lg:grid lg:grid-cols-[400px_1fr] lg:gap-8">
          {/* Ingredient Shrine - fixed on large scrollables */}
          <section className="lg:sticky lg:top-8 lg:self-start mb-8 lg:mb-0">
            <IngredientsList
              ingredients={createIngredients(recipe?.Ingredients) || []}
            />
          </section>

          {/* Scrollable Instructions of the Ancients */}
          <section>
            <Instructions instructions={recipe?.Instructions} />
          </section>
        </div>


        {/* Nutritional Information Section */}
        {recipe?.NutritionalValues?.length && (
          <section className="mt-8 space-y-6">
            <NutritionSummary
              ingredientNames={recipe.IngredientsName}
              quantities={recipe.IngredientsQuantity}
              units={recipe.IngredientsUnit}
              nutritionalValuesJson={recipe.NutritionalValues}
              servings={recipe.Servings}
            />
            <NutritionDetails
              ingredientNames={recipe.IngredientsName}
              quantities={recipe.IngredientsQuantity}
              units={recipe.IngredientsUnit}
              nutritionalValuesJson={recipe.NutritionalValues}
              servings={recipe.Servings}
            />
          </section>
        )}

      </div>
    </div>
  );
}
