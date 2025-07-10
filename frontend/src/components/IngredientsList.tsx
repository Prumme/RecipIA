import React from "react";
import IngredientItem from "./IngredientItem";
import { Ingredient } from "@/types/recipe.types";

interface IngredientsListProps {
  ingredients: Ingredient[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
        {ingredients.map((ingredient, index) => (
          <IngredientItem
            key={index}
            name={ingredient.IngredientsName}
            quantity={ingredient.IngredientsQuantity}
            unit={ingredient.IngredientsUnit}
            url={ingredient.IngredientsImages?.url}
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientsList;
