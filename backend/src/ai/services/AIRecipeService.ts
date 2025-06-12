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

Return ONLY a valid JSON object in this exact format:
{
  "Name": "Recipe name",
  "Slug": "recipe-name",
  "Instructions": ["Step 1 description", "Step 2 description"],
  "Servings": ${params.numberOfPersons},
  "DishType": "${params.dishType}",
  "PrepTime": 15,
  "Difficulty": "Easy",
  "Tags": ${params.tags},
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
        "vitamins": {
          "Vitamin C": 12.5,
          "Vitamin K": 7.2,
          "Vitamin A": 38.2,
          "Folate": 13.7,
          "Vitamin E": 0.5
        },
        "minerals": {
          "Potassium": 215.7
        }
      },
      "Intolerances": [],
      "Image": [],
      "quantity": 200,
      "unit": "g"
    }
  ]
}

Rules:
- Name: Capitalize first letter, simple ingredient names, singular form (e.g., "Tomato", not "Tomatoes")
- Slug: lowercase, no spaces, use hyphens
- Category: Must be one of: Fruits, Vegetables, Grains & Cereals, Legumes & Pulses, Dairy & Alternatives, Meat & Poultry, Fish & Seafood, Eggs, Nuts & Seeds, Fats & Oils, Herbs & Spices
- Difficulty: Must be one of: Easy, Medium, Hard
- NutritionalValues: Realistic values per 100g. calories, protein, carbohydrates and fat in grams, vitamins and minerals in mg.
- Intolerances: Empty array [] or relevant intolerances, e.g. ["Gluten", "Lactose"]. If given, must be in : Gluten, Lactose, Nuts, Soy, Eggs, Seafood, Sesame, Sulfites, Dairy, Nightshades
- Image: Always empty array []
- Include ALL required ingredients: ${params.ingredients.join(", ")}
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
