import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { bobUser } from "../../../factories/userFactory/userFactory";
import app from "../../app";
import databaseConnect from "../../../database/databaseConnection";
import mongoose from "mongoose";
import User from "../../../database/models/User/User";

let databaseServer: MongoMemoryServer;

beforeAll(async () => {
  databaseServer = await MongoMemoryServer.create();
  await databaseConnect(databaseServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await databaseServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a request GET /", () => {
  describe("When it receives a request", () => {
    test("Then it should send a response with status code 200 and message: 'Welcome to Recetorium API'", async () => {
      const expectedStatusCode = 200;
      const expectedResponseBody = { message: "Welcome to Recetorium API" };

      const response = await request(app).get("/").expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a request from a non whitelisted origin", () => {
    test("Then it should send a response with status code 400 and error: 'Cross-Origin Request Blocked'", async () => {
      const expectedStatusCode = 400;
      const expectedResponseBody = {
        error: "Cross-Origin Request Blocked",
      };

      const response = await request(app)
        .post("/")
        .set({ origin: "http://localhost:500" })
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});

describe("Given a request to a non existing endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should send a response with status code 404 and message: 'Endpoint not found'", async () => {
      const expectedStatusCode = 404;
      const expectedResponseBody = { error: "Endpoint not found" };

      const response = await request(app)
        .get("/no-endpoint")
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});

describe("Given a request POST /users/register", () => {
  const { username, password, email } = bobUser;

  describe("When it receives a body with username 'body', a valid password and email 'bob@this.com'", () => {
    test("Then it should send a response with status code 201 and message: 'User Bob was registered successfully.'", async () => {
      const expectedStatusCode = 201;
      const expectedResponseBody = {
        message: `User ${username} was registered successfully.`,
      };

      const response = await request(app)
        .post("/users/register")
        .send({ username, password, passwordConfirm: password, email })
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a body with an already registered user username 'body', a valid password and email 'bob@this.com'", () => {
    test("Then it should send a response with status code 400 and error: 'User already exists.'", async () => {
      const expectedStatusCode = 400;
      const expectedResponseBody = {
        error: "User already exists.",
      };

      await User.create({ username, password, email });

      const response = await request(app)
        .post("/users/register")
        .send({ username, password, passwordConfirm: password, email })
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a body without username", () => {
    test("Then it should send a response with status code 400 and error: 'username is required", async () => {
      const expectedStatusCode = 400;
      const expectedResponseBody = {
        error: '"username" is required',
      };

      const response = await request(app)
        .post("/users/register")
        .send({ password, passwordConfirm: password, email })
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});
