// This will start a copy of mongodb in memory it's going to allow
// us to run multiple differeent test suites at the same time across
// different projects without them reaching out to the same copy of mongo
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

let mongo: any;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

declare global {
  var getAuthCookie: () => Promise<string[]>;
}

global.getAuthCookie = async () => {
  const email = "test@test.com";
  const password = "password";

  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = signupResponse.get("Set-Cookie") || [];

  return cookie;
};
