import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
  RecipeStructure,
  Type,
} from "../../server/controllers/recipesControllers/types";

const recipeFactory = Factory.define<RecipeStructure>(() => ({
  id: faker.database.mongodbObjectId(),
  name: faker.name.firstName(),
  urlSlug: faker.internet.url(),
  author: faker.database.mongodbObjectId(),
  types: faker.helpers.arrayElements<Type>([
    { name: "desayuno" },
    { name: "almuerzo" },
    { name: "comida" },
    { name: "cena" },
    { name: "postre" },
  ]),
  ingredients: [
    { name: faker.lorem.word(), quantity: faker.lorem.words(2) },
    { name: faker.lorem.word(), quantity: faker.lorem.words(2) },
    { name: faker.lorem.word(), quantity: faker.lorem.words(2) },
  ],
  steps: [
    { step: faker.lorem.paragraph(), order: 1 },
    { step: faker.lorem.paragraph(), order: 2 },
    { step: faker.lorem.paragraph(), order: 3 },
  ],
  elaborationTime: faker.word.interjection(),
  image: faker.lorem.word(),
  backupImage: faker.internet.url(),
}));

export const recipeList = (numberOfRecipes: number): RecipeStructure[] =>
  recipeFactory.buildList(numberOfRecipes);
export const recipeTomatoSoup: RecipeStructure = recipeFactory.build({
  name: "Tomato soup",
  types: [{ name: "comida" }, { name: "cena" }],
});
