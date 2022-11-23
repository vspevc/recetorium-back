import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { UserStructure } from "../../server/controllers/usersControllers/types";

const userFactory = Factory.define<UserStructure>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  favoriteRecipes: [],
  scheduledRecipes: [],
  createdAt: Date.now(),
}));

export const bobUser = userFactory.build({
  username: "Bob",
  password: "silent",
  email: "bob@this.com",
});
