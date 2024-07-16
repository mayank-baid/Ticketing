import express from "express";
// To capture errors in async methods as well
import { json } from "body-parser";
import "express-async-errors";
import mongoose from "mongoose";
// Transport jwt during initial page load
import cookieSession from "cookie-session";
import dotenv from "dotenv";

import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { CurrentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

dotenv.config();

const app = express();
app.use(json());
app.use(
  cookieSession({
    signed: false, // Turn off encryption because if our multiple services are
    // in different languages it'll be very hard to decrypt
  })
);

// add routers
app.use(signUpRouter);
app.use(signInRouter);
app.use(CurrentUserRouter);
app.use(signOutRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.all("*", () => {
  throw new NotFoundError();
});

// Wire up the error handler middleware to capture errors
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
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
