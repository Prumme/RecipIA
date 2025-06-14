export interface Composition {
  Identity: number;
  Recipe: string[];
  Ingredient: string[];
  Quantity: number;
  Unit: string;
}

export type FieldToCreateComposition = Omit<Composition, "Identity">;
