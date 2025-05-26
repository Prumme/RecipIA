import { IUserRepository } from "../repositories/IUserRepository";
import { User } from "../entities/User";
import { AirtableResult } from "./AirtableResult";
import { z } from "zod";
import { AbstractAirtableRepository } from "./AbstractAirtableRepository";

const fieldSchema = z.object({
  Username: z.string().min(3).max(20),
  Email: z.string().email(),
  Password: z.string().min(8).max(22),
});

export class AirtableUserRepository
  extends AbstractAirtableRepository<typeof fieldSchema>
  implements IUserRepository
{
  protected getTableName(): string {
    return "Users";
  }

  protected getFieldSchema() {
    return fieldSchema;
  }

  public async findByEmail(query: {
    email: string;
  }): Promise<AirtableResult<User> | null> {
    const { email } = query;
    try {
      if (email == null) return null;
      const records = await this.getTable()
        .select({
          filterByFormula: `{Email} = '${this.escapeFilteringCharacters(
            email
          )}'`,
        })
        .all();
      if (records.length !== 1) {
        return null;
      }

      return this.convertToUser(this.validate(records[0]));
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  public async findByUsername(query: {
    username: string;
  }): Promise<AirtableResult<User> | null> {
    const { username } = query;
    try {
      if (username == null) return null;
      const records = await this.getTable()
        .select({
          filterByFormula: `{Username} = '${this.escapeFilteringCharacters(
            username
          )}'`,
        })
        .all();
      if (records.length !== 1) {
        return null;
      }

      return this.convertToUser(this.validate(records[0]));
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  public async create(user: User): Promise<AirtableResult<User>> {
    try {
      const record = await this.getTable().create({
        Username: user.Username,
        Email: user.Email,
        Password: user.Password,
      });
      return this.convertToUser(this.validate(record));
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  private convertToUser(
    record: z.infer<ReturnType<typeof this.getRecordSchema>>
  ): AirtableResult<User> {
    const { id, fields } = record;
    return {
      _airtableId: id,
      Username: fields.Username || "",
      Email: fields.Email || "",
      Password: fields.Password || "",
    };
  }
}
