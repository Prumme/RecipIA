import { Composition, FieldToCreateComposition } from "../entities/Composition";

export interface ICompositionRepository {
  create(composition: FieldToCreateComposition): Promise<Composition>;
}
