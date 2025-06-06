import { IRecipeListRepository } from "../repositories/IRecipeListRepository";
import { PaginatedCollection } from "../types/PaginatedCollection";
import { AirtableResult } from "./AirtableResult";
import { AbstractAirtableRepository } from "./AbstractAirtableRepository";
import { z } from "zod";
import { RecipeListItem, DishType, Difficulty, Tags } from "../entities/Recipe";
import { AirtableQueryPaginatedDecorator } from "./AirtableQueryPaginatedDecorator";

const fieldSchema = z.object({
  Name: z.string().min(1).max(100),
  Slug: z.string().min(1).max(100),
  Servings: z.number().int().positive(),
  DishType: z.nativeEnum(DishType),
  PrepTime: z.number().int().nonnegative(),
  Difficulty: z.nativeEnum(Difficulty),
  Tags: z.array(z.nativeEnum(Tags)).optional(),
  Intolerances: z.array(z.string()).optional(),
  Image: z.array(z.any()),
  AuthorName: z.array(z.string().min(1).max(100)),
});

export class AirtableRecipesListingRepository
  extends AbstractAirtableRepository<typeof fieldSchema>
  implements IRecipeListRepository
{
  protected getTableName(): string {
    return "Recipes";
  }

  protected getFieldSchema() {
    return fieldSchema;
  }

  public async findAll(query: {
    page: number;
    pageSize: number;
    search?: string;
    cache?: boolean;
  }): Promise<PaginatedCollection<AirtableResult<RecipeListItem>>> {
    const { page, pageSize, search, cache } = query;

    try {
      const conditions: string[] = [];
      if (search) {
        const safeSearch = this.escapeFilteringCharacters(search);
        let subConditions: string[] = [
          `FIND(LOWER('${safeSearch}'), LOWER({Name}))`,
        ];
        conditions.push(this.buildFilter(subConditions, "OR"));
      }

      conditions.push(`Private = FALSE()`);

      const query = this.getTable().select({
        fields: [
          "Name",
          "Slug",
          "Servings",
          "DishType",
          "PrepTime",
          "Difficulty",
          "Tags",
          "Intolerances",
          "Image",
          "AuthorName",
        ],
        filterByFormula: this.buildFilter(conditions, "AND"),
        pageSize,
      });
      const decoratedQuery = new AirtableQueryPaginatedDecorator(query, page);
      const [records, pagination] = await this.executeQueryFromCache(
        decoratedQuery,
        "paginate"
      );
      const safeRecords = this.validateAll(records);
      const recipes = safeRecords.map((record) =>
        this.convertToRecipeListItem(record)
      );
      return {
        items: recipes,
        page,
        pageSize,
        hasNextPage: pagination.hasNextPage,
        hasPreviousPage: pagination.hasPreviousPage,
      };
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw new Error("Failed to fetch recipes");
    }
  }

  public async findByAuthor(query: {
    authorUsername: string;
    page: number;
    pageSize: number;
    search?: string;
    cache?: boolean;
  }): Promise<PaginatedCollection<AirtableResult<RecipeListItem>>> {
    const { authorUsername, page, pageSize, search, cache } = query;

    try {
      const conditions: string[] = [];

      if (search) {
        const safeSearch = this.escapeFilteringCharacters(search);
        let subConditions: string[] = [
          `FIND(LOWER('${safeSearch}'), LOWER({Name}))`,
        ];
        conditions.push(this.buildFilter(subConditions, "OR"));
      }

      const safeAuthor = this.escapeFilteringCharacters(authorUsername);

      conditions.push(`FIND('${safeAuthor}', {Author} & '') > 0`);

      const query = this.getTable().select({
        fields: [
          "Name",
          "Slug",
          "Servings",
          "DishType",
          "PrepTime",
          "Difficulty",
          "Tags",
          "Intolerances",
          "Image",
          "AuthorName",
        ],
        filterByFormula: this.buildFilter(conditions, "AND"),
        pageSize,
      });
      const decoratedQuery = new AirtableQueryPaginatedDecorator(query, page);
      const [records, pagination] = await this.executeQueryFromCache(
        decoratedQuery,
        "paginate"
      );
      const safeRecords = this.validateAll(records);
      const recipes = safeRecords.map((record) =>
        this.convertToRecipeListItem(record)
      );
      return {
        items: recipes,
        page,
        pageSize,
        hasNextPage: pagination.hasNextPage,
        hasPreviousPage: pagination.hasPreviousPage,
      };
    } catch (error) {
      console.error("Error fetching recipes by author:", error);
      throw new Error("Failed to fetch recipes by author");
    }
  }

  private convertToRecipeListItem(
    record: z.infer<ReturnType<typeof this.getRecordSchema>>
  ): AirtableResult<RecipeListItem> {
    const { id, fields } = record;
    return {
      _airtableId: id,
      Name: fields.Name,
      Slug: fields.Slug,
      Servings: fields.Servings,
      DishType: fields.DishType,
      PrepTime: fields.PrepTime,
      Difficulty: fields.Difficulty,
      Tags: fields.Tags || [],
      Intolerances: fields.Intolerances || [],
      Image: fields.Image || null,
      AuthorName: fields.AuthorName || [],
    };
  }
}
