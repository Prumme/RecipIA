import { 
  NutritionalValues, 
  IngredientNutrition, 
  RecipeNutrition, 
  NutritionUnit 
} from "@/types/recipe.types";

/**
 * Parse une chaîne JSON des valeurs nutritionnelles
 */
export function parseNutritionalValues(jsonString: string): NutritionalValues {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      calories: parsed.calories || 0,
      protein: parsed.protein || 0,
      carbohydrates: parsed.carbohydrates || 0,
      fat: parsed.fat || 0,
      vitamins: parsed.vitamins || {},
      minerals: parsed.minerals || {},
    };
  } catch (error) {
    console.error("Erreur lors du parsing des valeurs nutritionnelles:", error);
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      vitamins: {},
      minerals: {},
    };
  }
}

/**
 * Calcule les valeurs nutritionnelles selon la quantité et l'unité
 * Les valeurs de base sont données pour:
 * - g/ml: pour 100g/100ml
 * - item: pour 1 item
 * - cup: pour 1 cup
 * - tablespoon: pour 1 tablespoon
 * - teaspoon: pour 1 teaspoon
 */
export function calculateNutritionalValues(
  baseValues: NutritionalValues,
  quantity: number,
  unit: NutritionUnit
): NutritionalValues {
  let multiplier = 1;

  // Calcul du multiplicateur selon l'unité
  switch (unit) {
    case "g":
    case "ml":
      // Les valeurs sont pour 100g/100ml, donc on divise par 100 puis multiplie par la quantité
      multiplier = quantity / 100;
      break;
    case "item":
    case "cup":
    case "tablespoon":
    case "teaspoon":
      // Les valeurs sont déjà pour 1 unité, on multiplie juste par la quantité
      multiplier = quantity;
      break;
    default:
      console.warn(`Unité non reconnue: ${unit}, utilisation de la quantité directe`);
      multiplier = quantity;
  }

  return {
    calories: Math.round((baseValues.calories * multiplier) * 100) / 100,
    protein: Math.round((baseValues.protein * multiplier) * 100) / 100,
    carbohydrates: Math.round((baseValues.carbohydrates * multiplier) * 100) / 100,
    fat: Math.round((baseValues.fat * multiplier) * 100) / 100,
    vitamins: Object.entries(baseValues.vitamins).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value * multiplier) * 100) / 100;
      return acc;
    }, {} as Record<string, number>),
    minerals: Object.entries(baseValues.minerals).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value * multiplier) * 100) / 100;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Additionne plusieurs valeurs nutritionnelles
 */
export function addNutritionalValues(values: NutritionalValues[]): NutritionalValues {
  if (values.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      vitamins: {},
      minerals: {},
    };
  }

  // Collecte toutes les clés de vitamines et minéraux
  const allVitaminKeys = new Set<string>();
  const allMineralKeys = new Set<string>();

  values.forEach(value => {
    Object.keys(value.vitamins).forEach(key => allVitaminKeys.add(key));
    Object.keys(value.minerals).forEach(key => allMineralKeys.add(key));
  });

  return {
    calories: Math.round(values.reduce((sum, val) => sum + val.calories, 0) * 100) / 100,
    protein: Math.round(values.reduce((sum, val) => sum + val.protein, 0) * 100) / 100,
    carbohydrates: Math.round(values.reduce((sum, val) => sum + val.carbohydrates, 0) * 100) / 100,
    fat: Math.round(values.reduce((sum, val) => sum + val.fat, 0) * 100) / 100,
    vitamins: Array.from(allVitaminKeys).reduce((acc, key) => {
      acc[key] = Math.round(values.reduce((sum, val) => sum + (val.vitamins[key] || 0), 0) * 100) / 100;
      return acc;
    }, {} as Record<string, number>),
    minerals: Array.from(allMineralKeys).reduce((acc, key) => {
      acc[key] = Math.round(values.reduce((sum, val) => sum + (val.minerals[key] || 0), 0) * 100) / 100;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Divise les valeurs nutritionnelles par un nombre (pour calculer les portions)
 */
export function divideNutritionalValues(
  values: NutritionalValues, 
  divisor: number
): NutritionalValues {
  if (divisor <= 0) {
    console.warn("Division par zéro ou nombre négatif, retour des valeurs originales");
    return values;
  }

  return {
    calories: Math.round((values.calories / divisor) * 100) / 100,
    protein: Math.round((values.protein / divisor) * 100) / 100,
    carbohydrates: Math.round((values.carbohydrates / divisor) * 100) / 100,
    fat: Math.round((values.fat / divisor) * 100) / 100,
    vitamins: Object.entries(values.vitamins).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value / divisor) * 100) / 100;
      return acc;
    }, {} as Record<string, number>),
    minerals: Object.entries(values.minerals).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value / divisor) * 100) / 100;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Calcule la nutrition complète d'une recette
 */
export function calculateRecipeNutrition(
  ingredientNames: string[],
  quantities: (string | number)[],
  units: string[],
  nutritionalValuesJson: string[],
  servings: number
): RecipeNutrition {
  // Création des ingrédients avec leurs valeurs nutritionnelles calculées
  const ingredients: IngredientNutrition[] = ingredientNames.map((name, index) => {
    const quantity = typeof quantities[index] === 'string' 
      ? parseFloat(quantities[index] as string) 
      : quantities[index] as number;
    const unit = units[index] as NutritionUnit;
    const baseValues = parseNutritionalValues(nutritionalValuesJson[index] || "{}");
    const calculatedValues = calculateNutritionalValues(baseValues, quantity, unit);

    return {
      ingredientName: name,
      quantity,
      unit,
      nutritionalValues: baseValues,
      calculatedValues,
    };
  });

  // Calcul des valeurs totales
  const totalValues = addNutritionalValues(
    ingredients.map(ingredient => ingredient.calculatedValues)
  );

  // Calcul des valeurs par portion
  const perServing = divideNutritionalValues(totalValues, servings);

  return {
    totalValues,
    perServing,
    ingredients,
  };
}
