export interface Type {
  name: "desayuno" | "almuerzo" | "comida" | "cena" | "postre";
}

interface Ingredient {
  name: string;
  quantity: string;
}

interface Step {
  step: string;
  order: number;
}

export interface RecipeMainData {
  name: string;
  author: string;
  types: Type[];
  ingredients: Ingredient[];
  steps: Step[];
  elaborationTime: string;
}
export interface RecipeStructure extends RecipeMainData {
  urlSlug: string;
  image: string;
  backupImage: string;
}

export interface SearchRecipeBody {
  name?: string;
  types?: Type[];
}

export interface SearchRecipeParams {
  page?: number;
  "per-page"?: number;
}

export interface SearchRecipeFilter {
  name?: RegExp;
  types?: unknown;
}

export type CreateRecipeBody = RecipeMainData;
