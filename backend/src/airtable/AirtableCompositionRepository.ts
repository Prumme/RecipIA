import { ICompositionRepository } from "../repositories/ICompositionRepository";
import { Composition, FieldToCreateComposition } from "../entities/Composition";
import { AirtableResult } from "./AirtableResult";
import { z } from "zod";
import { AbstractAirtableRepository } from "./AbstractAirtableRepository";

const fieldSchema = z.object({
  Identity: z.number().int(),
  Recipe: z.array(z.string()),
  Ingredient: z.array(z.string()),
  Quantity: z.number().min(0),
  Unit: z.string().max(50),
});

export class AirtableCompositionRepository
  extends AbstractAirtableRepository<typeof fieldSchema>
  implements ICompositionRepository
{
  protected getTableName(): string {
    return "Compositions";
  }

  protected getFieldSchema() {
    return fieldSchema;
  }

  public async create(
    composition: FieldToCreateComposition
  ): Promise<AirtableResult<Composition>> {
    try {
      const record = await this.getTable().create({
        Recipe: composition.Recipe,
        Ingredient: composition.Ingredient,
        Quantity: composition.Quantity,
        Unit: composition.Unit,
      });

      return this.convertToComposition(this.validate(record));
    } catch (error) {
      console.error("Error creating composition:", error);
      throw error;
    }
  }
  private convertToComposition(
    record: z.infer<ReturnType<typeof this.getRecordSchema>>
  ): AirtableResult<Composition> {
    const { id, fields } = record;
    return {
      _airtableId: id,
      Identity: fields.Identity,
      Recipe: fields.Recipe,
      Ingredient: fields.Ingredient,
      Quantity: fields.Quantity,
      Unit: fields.Unit,
    };
  }
}
