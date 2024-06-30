import express from "express";
// To capture errors in async methods as well
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

// add routers
app.use(signUpRouter);

app.all("*", () => {
  throw new NotFoundError();
});

// Wire up the error handler middleware to capture errors
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth service running on 3000");
  });
};

start();
