import { User } from "../entities/User";

export interface IUserRepository {
  findByEmail(query: { email: string }): Promise<User | null>;
  findByUsername(query: { username: string }): Promise<User | null>;
  create(user: User): Promise<User>;
}
