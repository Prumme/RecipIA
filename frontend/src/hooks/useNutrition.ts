import { useMemo } from "react";
import { RecipeNutrition } from "@/types/recipe.types";
import { calculateRecipeNutrition } from "@/utils/nutrition";

interface UseNutritionProps {
  ingredientNames: string[];
  quantities: string[];
  units: string[];
  nutritionalValuesJson: string[];
  servings: number;
}

interface UseNutritionReturn {
  nutrition: RecipeNutrition | null;
  isCalculated: boolean;
  totalCalories: number;
  caloriesPerServing: number;
}

/**
 * Hook personnalisé pour calculer et gérer les valeurs nutritionnelles d'une recette
 * Utilise useMemo pour éviter les recalculs inutiles
 */
export function useNutrition({
  ingredientNames,
  quantities,
  units,
  nutritionalValuesJson,
  servings,
}: UseNutritionProps): UseNutritionReturn {
  const nutrition = useMemo(() => {
    // Vérification que nous avons toutes les données nécessaires
    if (
      !ingredientNames?.length ||
      !quantities?.length ||
      !units?.length ||
      !nutritionalValuesJson?.length ||
      servings <= 0
    ) {
      return null;
    }

    // Vérification que tous les tableaux ont la même longueur
    const expectedLength = ingredientNames.length;
    if (
      quantities.length !== expectedLength ||
      units.length !== expectedLength ||
      nutritionalValuesJson.length !== expectedLength
    ) {
      console.warn("Les tableaux d'ingrédients n'ont pas la même longueur");
      return null;
    }

    try {
      return calculateRecipeNutrition(
        ingredientNames,
        quantities,
        units,
        nutritionalValuesJson,
        servings
      );
    } catch (error) {
      console.error("Erreur lors du calcul des valeurs nutritionnelles:", error);
      return null;
    }
  }, [ingredientNames, quantities, units, nutritionalValuesJson, servings]);

  // Valeurs dérivées pour un accès rapide
  const totalCalories = nutrition?.totalValues.calories || 0;
  const caloriesPerServing = nutrition?.perServing.calories || 0;
  const isCalculated = nutrition !== null;

  return {
    nutrition,
    isCalculated,
    totalCalories,
    caloriesPerServing,
  };
}

/**
 * Hook simplifié pour obtenir uniquement les macronutriments principaux
 */
export function useMainNutrients({
  ingredientNames,
  quantities,
  units,
  nutritionalValuesJson,
  servings,
}: UseNutritionProps) {
  const { nutrition, isCalculated } = useNutrition({
    ingredientNames,
    quantities,
    units,
    nutritionalValuesJson,
    servings,
  });

  const mainNutrients = useMemo(() => {
    if (!nutrition) return null;

    return {
      perServing: {
        calories: nutrition.perServing.calories,
        protein: nutrition.perServing.protein,
        carbohydrates: nutrition.perServing.carbohydrates,
        fat: nutrition.perServing.fat,
      },
      total: {
        calories: nutrition.totalValues.calories,
        protein: nutrition.totalValues.protein,
        carbohydrates: nutrition.totalValues.carbohydrates,
        fat: nutrition.totalValues.fat,
      },
    };
  }, [nutrition]);

  return {
    mainNutrients,
    isCalculated,
  };
}

/**
 * Hook pour obtenir les vitamines et minéraux formatés pour l'affichage
 */
export function useVitaminsAndMinerals({
  ingredientNames,
  quantities,
  units,
  nutritionalValuesJson,
  servings,
}: UseNutritionProps) {
  const { nutrition, isCalculated } = useNutrition({
    ingredientNames,
    quantities,
    units,
    nutritionalValuesJson,
    servings,
  });

  const vitaminsMinerals = useMemo(() => {
    if (!nutrition) return null;

    // Formatage des vitamines avec leurs valeurs par portion
    const vitamins = Object.entries(nutrition.perServing.vitamins)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        unit: "mg",
      }));

    // Formatage des minéraux avec leurs valeurs par portion
    const minerals = Object.entries(nutrition.perServing.minerals)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        unit: "mg",
      }));

    return {
      vitamins,
      minerals,
      hasVitamins: vitamins.length > 0,
      hasMinerals: minerals.length > 0,
    };
  }, [nutrition]);

  return {
    vitaminsMinerals,
    isCalculated,
  };
}
