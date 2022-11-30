import { Joi } from "express-validation";

const searchRecipesValidation = {
  body: Joi.object({
    name: Joi.string(),
    types: Joi.array().items(
      Joi.object({
        name: Joi.string().valid(
          "desayuno",
          "almuerzo",
          "comida",
          "cena",
          "postre"
        ),
      })
    ),
  }),
  query: Joi.object({
    page: Joi.number(),
    "per-page": Joi.number(),
  }),
};

export default searchRecipesValidation;
