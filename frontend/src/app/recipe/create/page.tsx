'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {IngredientsSelect} from '@/components/select/IngredientsSelect';
import {DifficultyTypes} from '@/types/difficulty.types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {Progress} from '@/components/ui/progress';
import {MultiSelect} from "@/components/select/Multiselect";
import {TagTypes} from '@/types/tag.types';
import {AllergenTypes} from "@/types/allergen.types";
import {Utensils, Tags, Swords, Users, Gauge, Vegan} from 'lucide-react'

export default function CreateRecipePage() {
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTypes>(DifficultyTypes.Easy);
    const [selectedTags, setSelectedTags] = useState<TagTypes[]>([]);
    const [participants, setParticipants] = useState<number>(1);
    const [selectedAllergens, setSelectedAllergens] = useState<AllergenTypes[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    function handleIngredientsChange(ingredients: string[]) {
        setSelectedIngredients(ingredients);
    }

    function handleDifficultyChange(value: string) {
        setSelectedDifficulty(value as DifficultyTypes);
    }

    function handleTagChange(values: string[]) {
        setSelectedTags(values as TagTypes[]);
    }

    function handleAllergenChange(allergens: string[]) {
        setSelectedAllergens(allergens);
    }

    const difficultyOptions = Object.values(DifficultyTypes).map(difficulty => ({
        label: difficulty,
        value: difficulty,
    }));

    const tagOptions = Object.values(TagTypes).map(tag => ({
        label: tag,
        value: tag,
    }));

    const allergenOptions = Object.values(AllergenTypes).map(allergen => ({
        label: allergen,
        value: allergen,
    }));

    useEffect(() => {
        if (!isLoading) {
            setProgress(0);
            return;
        }
        const interval = setInterval(() => {
            setProgress(oldProgress => {
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

        console.log({
            ingredients: selectedIngredients,
            difficulty: selectedDifficulty,
            tags: selectedTags,
        });

        // @TODO: Remplacer par appel API réel
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
                            <CardDescription>Fill in the details to create your recipe</CardDescription>
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

                            {/* Participants */}
                            <div className="space-y-2">
                                <Label htmlFor="recipe-participants">Participants</Label>
                                <input
                                    id="recipe-participants"
                                    type="number"
                                    min={1}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                                    value={participants}
                                    onChange={(e) => setParticipants(Number(e.target.value))}
                                />
                            </div>

                            {/* Difficulty */}
                            <div className="space-y-2">
                                <Label htmlFor="recipe-difficulty">Difficulty</Label>
                                <Select
                                    value={selectedDifficulty}
                                    onValueChange={handleDifficultyChange}
                                >
                                    <SelectTrigger className="w-full max-w-xs">
                                        <SelectValue placeholder="Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {difficultyOptions.map(option => (
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
                                {isLoading ? 'Creating recipe...' : 'Create the recipe'}
                            </Button>
                        </CardFooter>
                    </form>

                    {isLoading && (
                        <div className="mt-6 px-6">
                            <p className="mb-2 text-lg font-medium text-primary">
                                Recipe creation in progress... Please wait while AI generates your recipe.
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
                            <p>{participants} {participants === 1 ? 'person' : 'people'}</p>
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
                                        <span key={ingredient.tag_id || ingredient.food_name} className="...">
                                        {ingredient.food_name}
                                    </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No ingredients selected</p>
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
                                    {selectedTags.map(tag => (
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
                                    {selectedAllergens.map(allergen => (
                                        <span
                                            key={allergen}
                                            className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs"
                                        >
                                        {allergen}
                                      </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No allergens specified</p>
                            )}
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Gauge className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">Difficulty</h3>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs uppercase font-semibold ${
                                    selectedDifficulty === "Easy"
                                        ? "bg-green-100 text-green-800"
                                        : selectedDifficulty === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                }`}
                            >
              {selectedDifficulty}
            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
