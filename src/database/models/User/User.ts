import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  favoriteRecipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  scheduledRecipes: [
    {
      recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
      scheduledDate: Number,
    },
  ],
  createAt: {
    type: Number,
    default: Date.now(),
  },
});

const User = model("User", userSchema, "users");

export default User;
