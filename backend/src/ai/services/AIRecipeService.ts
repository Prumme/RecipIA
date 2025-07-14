import {
  IAIRecipeService,
  GenerateRecipeParams,
  AIRecipeData,
} from "../interfaces/IAIRecipeService";
import { IAIProvider } from "../interfaces/IAIProvider";

export class AIRecipeService implements IAIRecipeService {
  constructor(private aiProvider: IAIProvider) {}

  async generateRecipe(params: GenerateRecipeParams): Promise<AIRecipeData> {
    const prompt = this.buildPrompt(params);
    const response = await this.aiProvider.generateCompletion(prompt);

    try {
      const cleanedResponse = this.cleanJsonResponse(response);
      return JSON.parse(cleanedResponse) as AIRecipeData;
    } catch (error) {
      console.error("Failed to parse AI response:", response);
      throw new Error("Failed to parse AI response as JSON");
    }
  }

  private buildPrompt(params: GenerateRecipeParams): string {
    return `You are a professional chef assistant. Generate a recipe in JSON format with these requirements:

Requirements:
- Dish type: ${params.dishType}
- Style/Tags: ${params.tags.join(", ")}
- Must include these ingredients: ${params.ingredients.join(", ")}
- Avoid these intolerances: ${
      params.intolerances.length > 0 ? params.intolerances.join(", ") : "none"
    }
- Number of servings: ${params.numberOfPersons}

Return ONLY a valid JSON object in this exact format with multiple ingredient examples:
{
  "Name": "Recipe name",
  "Slug": "recipe-name",
  "Instructions": ["Step 1 description", "Step 2 description"],
  "Servings": ${params.numberOfPersons},
  "DishType": "${params.dishType}",
  "PrepTime": 15,
  "Difficulty": "Easy",
  "Tags": ${JSON.stringify(params.tags)},
  "Image": [],
  "ingredients": [
    {
      "Name": "Tomato",
      "Slug": "tomato", 
      "Category": "Vegetables",
      "NutritionalValues": {
        "calories": 18,
        "protein": 0.9,
        "carbohydrates": 3.9,
        "fat": 0.2,
        "vitamins": {"Vitamin C": 12.5},
        "minerals": {"Potassium": 215.7}
      },
      "Intolerances": [],
      "Image": [],
      "quantity": 200,
      "unit": "g"
    },
    {
      "Name": "Paprika",
      "Slug": "paprika",
      "Category": "Herbs & Spices", 
      "NutritionalValues": {
        "calories": 6,
        "protein": 0.3,
        "carbohydrates": 1.2,
        "fat": 0.3,
        "vitamins": {"Vitamin A": 21.8, "Vitamin C": 0.1},
        "minerals": {"Potassium": 50.4}
      },
      "Intolerances": [],
      "Image": [],
      "quantity": 2,
      "unit": "teaspoon"
    },
    {
      "Name": "Olive Oil",
      "Slug": "olive-oil",
      "Category": "Fats & Oils",
      "NutritionalValues": {
        "calories": 119,
        "protein": 0,
        "carbohydrates": 0,
        "fat": 13.5,
        "vitamins": {"Vitamin E": 1.9},
        "minerals": {}
      },
      "Intolerances": [],
      "Image": [],
      "quantity": 3,
      "unit": "tablespoon"
    }
  ]
}

CRITICAL NUTRITIONAL VALUES RULES - READ CAREFULLY:

The NutritionalValues field MUST be calculated differently based on the unit:

1. For unit "g" or "ml": 
   - Provide values per 100g or 100ml (standard reference)
   - Example above: 200g tomato → values per 100g tomato

2. For unit "teaspoon":
   - Provide values per 1 teaspoon (approximately 2-5g depending on ingredient)
   - Example above: 2 teaspoons paprika → values per 1 teaspoon paprika (~6 calories)
   - DO NOT use 100g values for spices in teaspoons!

3. For unit "tablespoon": 
   - Provide values per 1 tablespoon (approximately 15ml)
   - Example above: 3 tablespoons olive oil → values per 1 tablespoon (~119 calories)
   - DO NOT use 100ml values for ingredients in tablespoons!

4. For unit "item":
   - Provide values per 1 item (1 egg, 1 apple, etc.)

5. For unit "cup":
   - Provide values per 1 cup

NOTICE THE DIFFERENT CALORIE VALUES:
- Tomato (100g): 18 calories
- Paprika (1 teaspoon): 6 calories  
- Olive oil (1 tablespoon): 119 calories

These are VERY different because they represent different base units!

Other Rules:
- Name: Capitalize first letter, simple ingredient names, singular form (e.g., "Tomato", not "Tomatoes")
- Slug: lowercase, no spaces, use hyphens
- Category: Must be one of: Fruits, Vegetables, Grains & Cereals, Legumes & Pulses, Dairy & Alternatives, Meat & Poultry, Fish & Seafood, Eggs, Nuts & Seeds, Fats & Oils, Herbs & Spices
- Difficulty: Must be one of: Easy, Medium, Hard
- unit: Must be one of: g, ml, item (for single items like egg, apple, etc.), cup, tablespoon, teaspoon
- Intolerances: Empty array [] or relevant intolerances, e.g. ["Gluten", "Lactose"]. If given, must be in : Gluten, Lactose, Nuts, Soy, Eggs, Seafood, Sesame, Sulfites, Dairy, Nightshades
- Image: Always empty array []
- Include ALL required ingredients: ${params.ingredients.join(", ")}
- unit must always be set (if not applicable, if using a single item like egg, use "item")

DO NOT CONFUSE THE UNITS!
- 1 teaspoon paprika ≠ 100g paprika
- 1 tablespoon oil ≠ 100ml oil
- Use realistic small values for teaspoons/tablespoons!

- Respond with ONLY the JSON, no extra text`;
  }

  private cleanJsonResponse(response: string): string {
    // Remove markdown code blocks if present
    let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Remove any text before the first {
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace !== -1) {
      cleaned = cleaned.substring(firstBrace);
    }

    // Remove any text after the last }
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }

    return cleaned.trim();
  }
}
