import React from "react";
import { useMainNutrients } from "@/hooks/useNutrition";
import { MacroNutrientCard } from "./NutritionCard";
import { Activity } from "lucide-react";

interface NutritionSummaryProps {
  ingredientNames: string[];
  quantities: string[];
  units: string[];
  nutritionalValuesJson: string[];
  servings: number;
}

/**
 * Composant pour afficher le résumé nutritionnel de la recette (valeurs par portion)
 */
export default function NutritionSummary({
  ingredientNames,
  quantities,
  units,
  nutritionalValuesJson,
  servings,
}: NutritionSummaryProps) {
  const { mainNutrients, isCalculated } = useMainNutrients({
    ingredientNames,
    quantities,
    units,
    nutritionalValuesJson,
    servings,
  });

  if (!isCalculated || !mainNutrients) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-400">
            Nutritional Values
          </h3>
        </div>
        <p className="text-gray-500">
          Nutritional data not available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Nutritional Values
        </h3>
        <span className="text-sm text-gray-500">per serving</span>
      </div>

      {/* Macronutriments principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MacroNutrientCard
          type="calories"
          value={mainNutrients.perServing.calories}
        />
        <MacroNutrientCard
          type="protein"
          value={mainNutrients.perServing.protein}
        />
        <MacroNutrientCard
          type="carbohydrates"
          value={mainNutrients.perServing.carbohydrates}
        />
        <MacroNutrientCard
          type="fat"
          value={mainNutrients.perServing.fat}
        />
      </div>

      {/* Informations supplémentaires */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Values for {servings} serving{servings > 1 ? "s" : ""}</span>
          <span>
            Total recipe: {mainNutrients.total.calories.toFixed(0)} kcal
          </span>
        </div>
      </div>
    </div>
  );
}
