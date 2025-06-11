'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Cross, X} from "lucide-react";

type Ingredient = {
    food_name: string;
    photo: { thumb: string };
};

type IngredientSelect = {
    onValueChange: (ingredients: Ingredient[]) => void;
    placeholder?: string;
    maxCount?: number;
};

export function IngredientsSelect({
                                      onValueChange,
                                      placeholder = "Search for an ingredient...",
                                      maxCount = 10
                                  }: IngredientSelect) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const appId = '9107e073';
    const appKey = 'dcf8063680677b29cf7eddd702137fad';

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`, {
                    headers: {
                        'x-app-id': appId,
                        'x-app-key': appKey
                    }
                });
                const data = await res.json();
                const items: Ingredient[] = [...data.common, ...data.branded];
                setSuggestions(items);
            } catch (error) {
                console.error('Erreur fetch suggestions:', error);
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [query]);

    const addIngredient = (ingredient: Ingredient) => {
        if (selectedIngredients.some(i => i.food_name === ingredient.food_name)) return;
        if (selectedIngredients.length >= maxCount) return;

        const newSelected = [...selectedIngredients, ingredient];
        setSelectedIngredients(newSelected);
        onValueChange(newSelected);
        setQuery('');
        setSuggestions([]);
    };

    const removeIngredient = (food_name: string) => {
        const updated = selectedIngredients.filter(i => i.food_name !== food_name);
        setSelectedIngredients(updated);
        onValueChange(updated);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-md">
            <Label htmlFor="ingredient-search" className="sr-only">Search ingredients</Label>
            <Input
                id="ingredient-search"
                type="text"
                className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder={placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-autocomplete="list"
                aria-controls="suggestion-list"
                autoComplete="off"
            />

            {suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    id="suggestion-list"
                    role="listbox"
                    className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto
                    rounded-md border border-primary bg-white shadow-lg"
                >
                    {suggestions.map((ingredient, idx) => (
                        <div
                            key={ingredient.food_name}
                            role="option"
                            tabIndex={0}
                            className="flex cursor-pointer items-center gap-2 px-3 py-2
            hover:bg-primary/20 transition-colors duration-200 focus:bg-primary/20"
                            onClick={() => addIngredient(ingredient)}
                        >
                            <img
                                src={ingredient.photo.thumb}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover border-2 border-primary"
                                loading="lazy"
                            />
                            <span className="text-primary font-semibold">{ingredient.food_name}</span>
                        </div>
                    ))}
                </div>
            )}

            {query.length >= 2 && suggestions.length === 0 && (
                <div className="mt-2 text-sm text-muted-foreground">No ingredients found for « {query} ».</div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                    <div
                        key={ingredient.food_name}
                        className="flex items-center rounded-md bg-primary/20 px-3 py-2 text-sm font-semibold text-primary shadow gap-2"
                    >
                        <img
                            src={ingredient.photo.thumb}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover border-2 border-primary"
                            loading="lazy"
                        />
                        <span className="capitalize">
                {ingredient.food_name}
                </span>

                        <X
                            onClick={() => removeIngredient(ingredient.food_name)}
                            className="text-red-500 hover:text-red-700 size-4 hover:cursor-pointer"/>
                    </div>
                ))}
            </div>
        </div>
    );
}
