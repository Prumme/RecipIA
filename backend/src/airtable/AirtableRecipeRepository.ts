import { IRecipeRepository } from "../repositories/IRecipeRepository";
import {
  Recipe,
  DishType,
  Difficulty,
  Tags,
  FieldToCreateRecipe,
} from "../entities/Recipe";
import { AirtableResult } from "./AirtableResult";
import { z } from "zod";
import { AbstractAirtableRepository } from "./AbstractAirtableRepository";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const fieldSchema = z.object({
  Name: z.string().min(1).max(100),
  Slug: z.string().min(1).max(100),
  Instructions: z.string().min(1),
  Servings: z.number().int().positive(),
  DishType: z.nativeEnum(DishType),
  Ingredients: z.array(z.string()).nonempty(),
  IngredientsName: z.array(z.string()).nonempty(),
  PrepTime: z.number().int().nonnegative(),
  Difficulty: z.nativeEnum(Difficulty),
  Tags: z.array(z.nativeEnum(Tags)).optional(),
  CreatedAt: z.string().regex(dateRegex, "Invalid date format"),
  Intolerances: z.array(z.string()).optional(),
  Image: z
    .array(
      z.object({
        url: z.string().url(),
        filename: z.string(),
        thumbnails: z
          .record(z.string(), z.object({ url: z.string().url().optional() }))
          .optional(),
      })
    )
    .optional(),
  Compositions: z.array(z.string()).optional(),
  IngredientsQuantity: z.array(z.number()).optional(),
  IngredientsUnit: z.array(z.string()).optional(),
  Private: z.boolean().default(false),
  Author: z.array(z.string()),
  AuthorName: z.array(z.string().min(1).max(100)),
});

export class AirtableRecipeRepository
  extends AbstractAirtableRepository<typeof fieldSchema>
  implements IRecipeRepository
{
  protected getTableName(): string {
    return "Recipes";
  }

  protected getFieldSchema() {
    return fieldSchema;
  }

  public async findBySlug(query: {
    slug: string;
    cache?: boolean;
  }): Promise<AirtableResult<Recipe> | null> {
    const { slug, cache } = query;
    try {
      if (!slug) return null;
      const filterByFormula = `{Slug} = '${this.escapeFilteringCharacters(
        slug
      )}'`;
      const query = this.getTable().select({
        filterByFormula: filterByFormula,
      });

      const record =
        cache == !false
          ? await this.executeQueryFromCache(query, "all")
          : await query.all();

      if (record.length === 0) return null;
      return this.convertToRecipe(this.validate(record[0]));
    } catch (error) {
      console.error("Error finding recipe by slug:", error);
      throw error;
    }
  }

  public async create(
    recipe: FieldToCreateRecipe
  ): Promise<AirtableResult<Recipe>> {
    try {
      console.log("Creating recipe:", recipe);

      const createdRecord = await this.getTable().create({
        Name: recipe.Name,
        Slug: recipe.Slug,
        Instructions: recipe.Instructions,
        Servings: recipe.Servings,
        DishType: recipe.DishType,
        Ingredients: recipe.Ingredients,
        PrepTime: recipe.PrepTime,
        Difficulty: recipe.Difficulty,
        Tags: recipe.Tags || [],
        //Image: recipe.Image,
        Compositions: recipe.Compositions || [],
        Private: recipe.Private,
        Author: recipe.Author,
      });
      return this.convertToRecipe(this.validate(createdRecord));
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  }

  public async updateRecipePrivacy(query: {
    slug: string;
    private: boolean;
  }): Promise<AirtableResult<Recipe> | null> {
    const { slug, private: isPrivate } = query;
    try {
      const recipe = await this.findBySlug({ slug, cache: false });
      if (!recipe) return null;
      const updatedRecord = await this.getTable().update(recipe._airtableId, {
        Private: isPrivate,
      });
      return this.convertToRecipe(this.validate(updatedRecord));
    } catch (error) {
      console.error("Error updating recipe privacy:", error);
      throw error;
    }
  }

  private convertToRecipe(
    record: z.infer<ReturnType<typeof this.getRecordSchema>>
  ): AirtableResult<Recipe> {
    const { id, fields } = record;
    return {
      _airtableId: id,
      Name: fields.Name,
      Slug: fields.Slug,
      Instructions: fields.Instructions,
      Servings: fields.Servings,
      DishType: fields.DishType,
      Ingredients: fields.Ingredients,
      IngredientsName: fields.IngredientsName,
      PrepTime: fields.PrepTime,
      Difficulty: fields.Difficulty,
      Tags: fields.Tags || [],
      CreatedAt: fields.CreatedAt,
      Intolerances: fields.Intolerances || [],
      Image: fields.Image || [],
      Compositions: fields.Compositions || [],
      IngredientsQuantity: fields.IngredientsQuantity || [],
      IngredientsUnit: fields.IngredientsUnit || [],
      Private: fields.Private || false,
      Author: fields.Author || [],
      AuthorName: fields.AuthorName || [],
    };
  }
}
