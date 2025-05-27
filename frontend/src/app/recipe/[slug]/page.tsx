import React from "react";
import IngredientsList from "@/components/IngredientsList";
import Instructions from "@/components/Instructions";
import { Clock, Users, ChefHat, Tag, AlertCircle } from "lucide-react";

// Cette fonction sera remplacée par un appel API réel plus tard
const getRecipeBySlug = (slug: string) => {
  return {
    name: "Ratatouille Provençale",
    servings: 4,
    preparationTime: 45,
    difficulty: "Medium",
    tags: ["Vegetarien", "Healthy", "Méditerranéen"],
    intolerances: ["Sans Gluten"],
    ingredients: [
      {
        name: "Aubergine",
        quantity: "2",
        unit: "pièces",
      },
      {
        name: "Courgette",
        quantity: "3",
        unit: "pièces",
      },
      {
        name: "Poivron",
        quantity: "2",
        unit: "pièces",
        imageUrl:
          "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80",
      },
      {
        name: "Tomate",
        quantity: "4",
        unit: "pièces",
        imageUrl:
          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80",
      },
      {
        name: "Oignon",
        quantity: "2",
        unit: "pièces",
        imageUrl:
          "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=500&q=80",
      },
      {
        name: "Ail",
        quantity: "3",
        unit: "gousses",
      },
      {
        name: "Huile d'olive",
        quantity: "4",
        unit: "cuillères à soupe",
        imageUrl:
          "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80",
      },
    ],
    instructions: [
      "Lavez et coupez tous les légumes en rondelles d'épaisseur moyenne.",
      "Faites revenir les oignons et l'ail dans l'huile d'olive.",
      "Ajoutez les aubergines et les courgettes, laissez cuire 10 minutes.",
      "Incorporez les poivrons et les tomates.",
      "Laissez mijoter à feu doux pendant 30 minutes.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
      "Assaisonnez selon votre goût avec sel, poivre et herbes de Provence.",
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
        {/* En-tête normal */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-6">{recipe.name}</h1>

          {/* Tags et Intolérances */}
          <div className="flex flex-wrap gap-4 mb-6">
            {recipe.tags && recipe.tags.length > 0 && (
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

            {recipe.intolerances && recipe.intolerances.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" />
                {recipe.intolerances.map((intolerance, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium"
                  >
                    {intolerance}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Informations de la recette */}
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{recipe.servings} personnes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{recipe.preparationTime} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat size={20} />
              <span>Difficulté : {recipe.difficulty}</span>
            </div>
          </div>
        </header>

        {/* Layout adaptatif */}
        <div className="lg:grid lg:grid-cols-[400px_1fr] lg:gap-8">
          {/* Section des ingrédients - fixe sur desktop */}
          <section className="lg:sticky lg:top-8 lg:self-start mb-8 lg:mb-0">
            <IngredientsList ingredients={recipe.ingredients} />
          </section>

          {/* Section des instructions - scrollable */}
          <section>
            <Instructions steps={recipe.instructions} />
          </section>
        </div>
      </div>
    </div>
  );
}
