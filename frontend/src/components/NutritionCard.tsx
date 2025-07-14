import React from "react";
import { NutritionalValues } from "@/types/recipe.types";

interface NutritionCardProps {
  label: string;
  value: number;
  unit: string;
  className?: string;
  showProgress?: boolean;
  maxValue?: number;
}

/**
 * Composant réutilisable pour afficher une valeur nutritionnelle
 */
export default function NutritionCard({
  label,
  value,
  unit,
  className = "",
  showProgress = false,
  maxValue = 100,
}: NutritionCardProps) {
  const progressPercentage = showProgress ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-lg font-bold text-gray-900">
          {value.toFixed(1)}
          <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
        </span>
      </div>
      
      {showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Composant pour afficher les macronutriments principaux avec couleurs distinctes
 */
interface MacroNutrientCardProps {
  type: "calories" | "protein" | "carbohydrates" | "fat";
  value: number;
  className?: string;
}

export function MacroNutrientCard({ type, value, className = "" }: MacroNutrientCardProps) {
  const configs = {
    calories: {
      label: "Calories",
      unit: "kcal",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-900",
      iconColor: "text-orange-600",
    },
    protein: {
      label: "Protein",
      unit: "g",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-900",
      iconColor: "text-red-600",
    },
    carbohydrates: {
      label: "Carbs",
      unit: "g",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      iconColor: "text-green-600",
    },
    fat: {
      label: "Fat",
      unit: "g",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-900",
      iconColor: "text-yellow-600",
    },
  };

  const config = configs[type];

  return (
    <div className={`${config.bgColor} ${config.borderColor} rounded-lg p-4 border ${className}`}>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </span>
        <span className={`text-xl font-bold ${config.textColor}`}>
          {value.toFixed(1)}
          <span className="text-sm font-normal ml-1">{config.unit}</span>
        </span>
      </div>
    </div>
  );
}
