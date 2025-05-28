import { IIngredientRepository } from "../repositories/IIngredientRepository";
import {
  Ingredient,
  IngredientCategory,
  Intolerance,
} from "../entities/Ingredient";
import { AirtableResult } from "./AirtableResult";
import { z } from "zod";
import { AbstractAirtableRepository } from "./AbstractAirtableRepository";

//const nutritionalValuesSchema = z.object({
//  calories: z.number(),
//  protein: z.number(),
//  carbohydrates: z.number(),
//  fat: z.number(),
//  vitamins: z.record(z.string(), z.number()),
//  minerals: z.record(z.string(), z.number()),
//});

const fieldSchema = z.object({
  Name: z.string().min(1).max(100),
  Category: z.nativeEnum(IngredientCategory),
  NutritionalValues: z.string(),
  Intolerances: z.array(z.nativeEnum(Intolerance)).optional(),
});

export class AirtableIngredientRepository
  extends AbstractAirtableRepository<typeof fieldSchema>
  implements IIngredientRepository
{
  protected getTableName(): string {
    return "Ingredients";
  }

  protected getFieldSchema() {
    return fieldSchema;
  }

  public async findByName(query: {
    name: string;
  }): Promise<AirtableResult<Ingredient> | null> {
    const { name } = query;
    try {
      if (name == null) return null;
      const records = await this.getTable()
        .select({
          filterByFormula: `{Name} = '${this.escapeFilteringCharacters(name)}'`,
        })
        .all();
      if (records.length !== 1) {
        return null;
      }

      return this.convertToIngredient(this.validate(records[0]));
    } catch (error) {
      console.error("Error finding ingredient by name:", error);
      throw error;
    }
  }

  public async create(
    ingredient: Ingredient
  ): Promise<AirtableResult<Ingredient>> {
    try {
      const record = await this.getTable().create({
        Name: ingredient.Name,
        Category: ingredient.Category,
        NutritionalValues: JSON.stringify(ingredient.NutritionalValues), // serialize
        Intolerances: ingredient.Intolerances,
      });
      return this.convertToIngredient(this.validate(record));
    } catch (error) {
      console.error("Error creating ingredient:", error);
      throw error;
    }
  }

  private convertToIngredient(
    record: z.infer<ReturnType<typeof this.getRecordSchema>>
  ): AirtableResult<Ingredient> {
    const { id, fields } = record;
    return {
      _airtableId: id,
      Name: fields.Name,
      Category: fields.Category,
      NutritionalValues:
        typeof fields.NutritionalValues === "string"
          ? JSON.parse(fields.NutritionalValues)
          : fields.NutritionalValues,
      Intolerances: fields.Intolerances || [],
    };
  }
}
