import React, { useState } from "react";
import { useNutrition, useVitaminsAndMinerals } from "@/hooks/useNutrition";
import NutritionCard, { MacroNutrientCard } from "./NutritionCard";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface NutritionDetailsProps {
  ingredientNames: string[];
  quantities: string[];
  units: string[];
  nutritionalValuesJson: string[];
  servings: number;
}

/**
 * Composant pour afficher les détails nutritionnels complets avec toggle
 */
export default function NutritionDetails({
  ingredientNames,
  quantities,
  units,
  nutritionalValuesJson,
  servings,
}: NutritionDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { nutrition, isCalculated } = useNutrition({
    ingredientNames,
    quantities,
    units,
    nutritionalValuesJson,
    servings,
  });

  const { vitaminsMinerals } = useVitaminsAndMinerals({
    ingredientNames,
    quantities,
    units,
    nutritionalValuesJson,
    servings,
  });

  if (!isCalculated || !nutrition) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header avec toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Nutrition Details
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>

      {/* Contenu détaillé */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Détail par ingrédient */}
          <div className="mb-8">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              Contribution per ingredient
            </h4>
            <div className="space-y-4">
              {nutrition.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-gray-900">
                      {ingredient.ingredientName}
                    </h5>
                    <span className="text-sm text-gray-500">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium text-orange-600">
                        {ingredient.calculatedValues.calories.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600">
                        {ingredient.calculatedValues.protein.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">g protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-600">
                        {ingredient.calculatedValues.carbohydrates.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">g carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-yellow-600">
                        {ingredient.calculatedValues.fat.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">g fat</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitamines et Minéraux */}
          {vitaminsMinerals && (vitaminsMinerals.hasVitamins || vitaminsMinerals.hasMinerals) && (
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">
                Vitamins and Minerals (per serving)
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vitamins */}
                {vitaminsMinerals.hasVitamins && (
                  <div>
                    <h5 className="text-sm font-medium text-purple-700 mb-3">
                      Vitamins
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {vitaminsMinerals.vitamins.map((vitamin, index) => (
                        <NutritionCard
                          key={index}
                          label={vitamin.name}
                          value={vitamin.value}
                          unit={vitamin.unit}
                          className="bg-purple-50 border-purple-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Minerals */}
                {vitaminsMinerals.hasMinerals && (
                  <div>
                    <h5 className="text-sm font-medium text-indigo-700 mb-3">
                      Minerals
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {vitaminsMinerals.minerals.map((mineral, index) => (
                        <NutritionCard
                          key={index}
                          label={mineral.name}
                          value={mineral.value}
                          unit={mineral.unit}
                          className="bg-indigo-50 border-indigo-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
