import { model, Schema } from "mongoose";

const typeSchema = new Schema({
  name: {
    type: String,
    enum: ["desayuno", "almuerzo", "comida", "cena", "postre"],
    required: true,
  },
});
const ingredientsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});
const stepsSchema = new Schema({
  step: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  urlSlug: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  types: {
    type: [typeSchema],
    required: true,
  },
  ingredients: {
    type: [ingredientsSchema],
    required: true,
  },
  steps: {
    type: [stepsSchema],
    required: true,
  },
  elaborationTime: {
    type: String,
    maxLenght: 8,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  backupImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const Recipe = model("Recipe", recipeSchema, "recipes");

export default Recipe;
