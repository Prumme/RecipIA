"use client";

import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/recipe.types";

import { Users, Clock, ChefHat, Tags } from "lucide-react";
import { API_URL } from "@/core/constant";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const gridClassName =
  "grid grid-cols-[2fr_100px_100px_150px_1fr] gap-4 items-center px-6";

export default function MesRecettes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user, isAuthenticated } = useAuth();
  console.log(user);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(
        `${API_URL}recipes/author/${user?.Username}`
      );
      const data = await response.json();
      setRecipes(data.items);
    };
    fetchRecipes();
  }, [user]);

  return (
    <div className="min-h-screen px-4">
      <header className="mb-8 text-center py-8">
        <h1 className="text-3xl font-bold mb-4">Mes Recettes</h1>
        <p className="text-gray-600">Découvrez vos recettes personnelles</p>
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
            <div>Difficulté</div>
            <div className="flex items-center gap-2">
              <Tags size={16} />
              <span>Tags</span>
            </div>
          </div>

          {/* Corps de la table */}
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} className={gridClassName} />
          ))}
        </div>
      </main>
    </div>
  );
}
