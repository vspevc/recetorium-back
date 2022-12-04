import fs from "fs/promises";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import databaseConnect from "../../../database/databaseConnection";
import Recipe from "../../../database/models/Recipe/Recipe";
import {
  recipeList,
  recipeTomatoSoup,
} from "../../../factories/recipeFactory/recipeFactory";
import { paginationDefaults } from "../../../utils/pagination/getPagination";
import app from "../../app";
import type { RecipeStructure } from "../../controllers/recipesControllers/types";
import bucket from "../../../utils/supabaseConfig";
import path from "path";
import imagePath from "../../../utils/images/imagePath";

let databaseServer: MongoMemoryServer;

beforeAll(async () => {
  databaseServer = await MongoMemoryServer.create();
  await databaseConnect(databaseServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await databaseServer.stop();

  const imagesPath = path.join(imagePath.base, imagePath.recipesFolder);
  const imagesDirectory = await fs.readdir(imagesPath);

  imagesDirectory.forEach(async (image) => {
    if (image.startsWith("test-mock-")) {
      await fs.unlink(path.join(imagesPath, image));
    }
  });
});

afterEach(async () => {
  await Recipe.deleteMany({});
});

bucket.upload = jest.fn();

describe("Given the endpoit GET /recipes/search", () => {
  const { perPage } = paginationDefaults;
  const searchPath = "/recipes/search";

  describe("When it receives a request without body neither query", () => {
    test("Then it should send with status code 200 and previousPage 'null'", async () => {
      const expectedStatus = 200;
      const expectedRecipes = recipeList(perPage);
      const recipes = [...expectedRecipes, ...recipeList(20)];
      const recipesCount = recipes.length;
      const previousPage = null as string;
      const nextPage = `${searchPath}?page=2`;
      const totalPages = Math.ceil(recipesCount / perPage);
      await Recipe.insertMany(recipes);

      const response: {
        body: {
          previousPage: string;
          nextPage: string;
          totalPages: number;
          recipes: RecipeStructure[];
        };
      } = await request(app).get(searchPath).expect(expectedStatus);

      const {
        previousPage: bodyPreviousPage,
        nextPage: bodyNextPage,
        totalPages: bodyTotalPages,
        recipes: bodyRecipes,
      } = response.body;

      expect(bodyPreviousPage).toStrictEqual(previousPage);
      expect(bodyNextPage).toStrictEqual(nextPage);
      expect(bodyTotalPages).toBe(totalPages);
      expect(bodyRecipes).toHaveLength(perPage);
    });
  });

  describe("When it receives a request with body name 'tomato soup'", () => {
    test("Then it should send a response with status 200 and a list with only 'Tomato soup' recipe", async () => {
      const expectedStatus = 200;
      const expectedRecipe = recipeTomatoSoup;
      const expectedRecipesLength = 1;
      const requestName = { name: "tomato soup" };
      const recipes = [...recipeList(20), expectedRecipe];
      await Recipe.insertMany(recipes);

      const response: {
        body: {
          recipes: RecipeStructure[];
        };
      } = await request(app)
        .get(searchPath)
        .send(requestName)
        .expect(expectedStatus);
      const { recipes: bodyRecipes } = response.body;

      expect(bodyRecipes).toHaveLength(expectedRecipesLength);
      expect(bodyRecipes[0].name).toMatch(RegExp(requestName.name, "i"));
    });
  });
});

describe("Given the endpoint POST /recipes/create", () => {
  const { name, author, types, ingredients, steps, elaborationTime } =
    recipeTomatoSoup;
  const createPath = "/recipes/create";

  describe("When it receives a request with a valid recipe with name 'Tomato soup' and image 'test-mock-tomato-soup.jpg'", () => {
    test("Then it should send a response with status 201 and json message 'Recipe `Tomato soup` was created successfully'", async () => {
      const image = "src/fixtures/recipes/test-mock-tomato-soup.jpg";
      const expectedStatus = 201;
      const expectedBody = {
        message: 'Recipe "Tomato soup" was created successfully',
      };

      const response = await request(app)
        .post(createPath)
        .field("name", name)
        .field("author", author)
        .field("types[0][name]", types[0].name)
        .field("ingredients[0][name]", ingredients[0].name)
        .field("ingredients[0][quantity]", ingredients[0].quantity)
        .field("steps[0][step]", steps[0].step)
        .field("steps[0][order]", steps[0].order)
        .field("elaborationTime", elaborationTime)
        .attach("image", image)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedBody);
    });
  });

  describe("When it receives a request with a valid recipe with name 'Tomato soup' and without image", () => {
    test("Then it should send a response with status 201 and json message 'Recipe `Tomato soup` was created successfully'", async () => {
      const expectedStatus = 201;
      const expectedBody = {
        message: 'Recipe "Tomato soup" was created successfully',
      };

      const response = await request(app)
        .post(createPath)
        .field("name", name)
        .field("author", author)
        .field("types[0][name]", types[0].name)
        .field("ingredients[0][name]", ingredients[0].name)
        .field("ingredients[0][quantity]", ingredients[0].quantity)
        .field("steps[0][step]", steps[0].step)
        .field("steps[0][order]", steps[0].order)
        .field("elaborationTime", elaborationTime)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedBody);
    });
  });

  describe("When it receives a request with an invalid recipe with empty name", () => {
    test("Then it should send a response with status 400 and error '`name` is not allowed to be empty'", async () => {
      const emptyName = "";
      const expectedStatus = 400;
      const expectedBody = {
        error: '"name" is not allowed to be empty',
      };

      const response = await request(app)
        .post(createPath)
        .field("name", emptyName)
        .field("author", author)
        .field("types[0][name]", types[0].name)
        .field("ingredients[0][name]", ingredients[0].name)
        .field("ingredients[0][quantity]", ingredients[0].quantity)
        .field("steps[0][step]", steps[0].step)
        .field("steps[0][order]", steps[0].order)
        .field("elaborationTime", elaborationTime)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedBody);
    });
  });
});
