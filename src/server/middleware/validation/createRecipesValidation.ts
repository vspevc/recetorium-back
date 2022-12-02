import { Joi } from "express-validation";

const createRecipesValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    author: Joi.string().required(),
    types: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().valid(
            "desayuno",
            "almuerzo",
            "comida",
            "cena",
            "postre"
          ),
        })
      )
      .required(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          name: Joi.string(),
          quantity: Joi.string(),
        })
      )
      .required(),
    steps: Joi.array()
      .items(
        Joi.object({
          step: Joi.string(),
          order: Joi.number(),
        })
      )
      .required(),
    elaborationTime: Joi.string().max(13).required(),
    image: Joi.boolean().valid(true),
  }),
};

export default createRecipesValidation;
