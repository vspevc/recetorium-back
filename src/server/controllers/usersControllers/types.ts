import type { Schema } from "mongoose";

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterUserBody extends Credentials {
  confirmPassword: string;
  email: string;
}

export interface UserStructure extends Credentials {
  id?: Schema.Types.ObjectId;
  email: string;
  favoriteRecipes: Schema.Types.ObjectId[];
  scheduledRecipes: Schema.Types.ObjectId[];
  createdAt: number;
}
