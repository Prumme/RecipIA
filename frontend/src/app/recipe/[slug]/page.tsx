import React from "react";
import IngredientsList from "@/components/IngredientsList";
import Instructions from "@/components/Instructions";
import { Clock, Users, ChefHat, Tag, AlertCircle } from "lucide-react";

// This mighty function shall later be replaced by a true API summoner
const getRecipeBySlug = (slug: string) => {
  return {
    name: "Provencal Ratatouille",
    servings: 4,
    preparationTime: 45,
    difficulty: "Medium",
    tags: ["Vegetarian", "Healthy", "Mediterranean"],
    intolerances: ["Without Gluten"],
    ingredients: [
      { name: "Eggplant", quantity: "2", unit: "pieces" },
      { name: "Zucchini", quantity: "3", unit: "pieces" },
      {
        name: "Pepper",
        quantity: "2",
        unit: "pieces",
        imageUrl:
            "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80",
      },
      {
        name: "Tomato",
        quantity: "4",
        unit: "pieces",
        imageUrl:
            "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80",
      },
      {
        name: "Onion",
        quantity: "2",
        unit: "pieces",
        imageUrl:
            "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=500&q=80",
      },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      {
        name: "Olive Oil",
        quantity: "4",
        unit: "tablespoons",
        imageUrl:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80",
      },
    ],
    instructions: [
      "Wash and slice all vegetables into medium-thick rounds.",
      "Sauté onions and garlic in olive oil.",
      "Add eggplants and zucchinis, let cook for 10 minutes.",
      "Stir in peppers and tomatoes.",
      "Simmer on low heat for 30 minutes.",
      "Season to taste with salt, pepper, and Herbes de Provence.",
    ],
  };
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function RecipePage({ params }: PageProps) {
  const recipe = getRecipeBySlug(params.slug);

  return (
      <div className="min-h-screen py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Honorable Recipe Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-6">{recipe.name}</h1>

            {/* Magnificent Tags & Warnings */}
            <div className="flex flex-wrap gap-4 mb-6">
              {recipe.tags?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag size={18} className="text-blue-600" />
                    {recipe.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                        >
                    {tag}
                  </span>
                    ))}
                  </div>
              )}

              {recipe.intolerances?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <AlertCircle size={18} className="text-amber-600" />
                    {recipe.intolerances.map((warning, index) => (
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
                <span>{recipe.servings} lovely humans</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{recipe.preparationTime} minutes of culinary joy</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat size={20} />
                <span>Skill level: {recipe.difficulty}</span>
              </div>
            </div>
          </header>

          {/* The Mighty Grid of Culinary Knowledge */}
          <div className="lg:grid lg:grid-cols-[400px_1fr] lg:gap-8">
            {/* Ingredient Shrine - fixed on large scrollables */}
            <section className="lg:sticky lg:top-8 lg:self-start mb-8 lg:mb-0">
              <IngredientsList ingredients={recipe.ingredients} />
            </section>

            {/* Scrollable Instructions of the Ancients */}
            <section>
              <Instructions steps={recipe.instructions} />
            </section>
          </div>
        </div>
      </div>
  );
}