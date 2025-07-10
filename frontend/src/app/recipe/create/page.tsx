"use client";

import { IngredientsSelect } from "@/components/select/IngredientsSelect";
import { MultiSelect } from "@/components/select/Multiselect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DifficultyTypes } from "@/types/difficulty.types";
import { Gauge, Tags, Users, Utensils, Vegan } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tags as TagType,
  Intolerance as IntoleranceType,
  DishType,
} from "@/types/recipe.types";
import { API_URL } from "@/core/constant";

interface RecipeProps {
  ingredients: string[];
  dishType: DishType;
  tags: TagType[];
  intolerances: IntoleranceType[];
  numberOfPersons: number;
}

export default function CreateRecipePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedDishType, setSelectedDishType] = useState<DishType>(
    DishType.MainCourse
  );
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [participants, setParticipants] = useState<number>(1);
  const [selectedAllergens, setSelectedAllergens] = useState<IntoleranceType[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleIngredientsChange(
    ingredients: { food_name: string; photo: { thumb: string } }[]
  ) {
    const ingredientNames = ingredients.map(
      (ingredient) => ingredient.food_name
    );
    setSelectedIngredients(ingredientNames);
  }

  function handleDishTypeChange(value: string) {
    setSelectedDishType(value as DishType);
  }

  function handleTagChange(values: string[]) {
    setSelectedTags(values as TagType[]);
  }

  function handleAllergenChange(allergens: string[]) {
    setSelectedAllergens(allergens as IntoleranceType[]);
  }

  const dishTypeOptions = Object.values(DishType).map((dishType) => ({
    label: dishType,
    value: dishType,
  }));

  const tagOptions = Object.values(TagType).map((tag) => ({
    label: tag,
    value: tag,
  }));

  const allergenOptions = Object.values(IntoleranceType).map((allergen) => ({
    label: allergen,
    value: allergen,
  }));

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const recipe: RecipeProps = {
      ingredients: selectedIngredients,
      dishType: selectedDishType,
      tags: selectedTags,
      intolerances: selectedAllergens,
      numberOfPersons: participants,
    };

    console.log(recipe);

    fetch(`${API_URL}generate-recipe`, {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  return (
    <div className="min-h-screen py-8 px-4 mt-16 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Create a recipe</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Card */}
        <Card className="flex-1">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Recipe Form</CardTitle>
              <CardDescription>
                Fill in the details to create your recipe
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="recipe-ingredients">Ingredients</Label>
                <IngredientsSelect
                  onValueChange={handleIngredientsChange}
                  placeholder="Search for ingredients..."
                  maxCount={10}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="recipe-tags">Tags</Label>
                <MultiSelect
                  options={tagOptions}
                  value={selectedTags}
                  onValueChange={handleTagChange}
                  className="w-full max-w-md"
                />
              </div>

              {/* Allergens */}
              <div className="space-y-2">
                <Label htmlFor="recipe-allergens">Allergens</Label>
                <MultiSelect
                  options={allergenOptions}
                  value={selectedAllergens}
                  onValueChange={handleAllergenChange}
                  className="w-full max-w-md"
                />
              </div>

              {/* Number of servings */}
              <div className="space-y-2">
                <Label htmlFor="recipe-participants">Number of servings</Label>
                <input
                  id="recipe-participants"
                  type="number"
                  min={1}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                />
              </div>

              {/* Dish Type */}
              <div className="space-y-2">
                <Label htmlFor="recipe-dish-type">Dish Type</Label>
                <Select
                  value={selectedDishType}
                  onValueChange={handleDishTypeChange}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Dish Type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {dishTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating recipe..." : "Create the recipe"}
              </Button>
            </CardFooter>
          </form>

          {isLoading && (
            <div className="mt-6 px-6">
              <p className="mb-2 text-lg font-medium text-primary">
                Recipe creation in progress... Please wait while AI generates
                your recipe.
              </p>
              <Progress value={progress} />
            </div>
          )}
        </Card>

        {/* Summary Card */}
        <Card className="w-full lg:w-96 flex flex-col">
          <CardHeader>
            <CardTitle>Recipe Summary</CardTitle>
            <CardDescription>Review your selections</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Participants */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Participants</h3>
              </div>
              <p>
                {participants} {participants === 1 ? "person" : "people"}
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Ingredients</h3>
              </div>
              {selectedIngredients.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {selectedIngredients.map((ingredient) => (
                    <span key={ingredient} className="...">
                      {ingredient}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No ingredients selected
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Tags</h3>
              </div>
              {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No tags selected</p>
              )}
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Vegan className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Allergens</h3>
              </div>
              {selectedAllergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedAllergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No allergens specified
                </p>
              )}
            </div>

            {/* Dish Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Dish Type</h3>
              </div>
              <span className="px-2 py-1 text-xs uppercase font-semibold">
                {selectedDishType}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
