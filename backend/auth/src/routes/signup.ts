import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  async (req: Request, res: Response) => {
    // Validation, checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // Steps:
    // 1. Does a user with this email alredy exist? If so, respond with error
    // 2. Hash the password user entered
    // 3. Create a new User and save them to MongoDB
    // 4. User logged in. Send them a cookie/jwt/something

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) throw new BadRequestError("Email already in use");

    const user = User.build({ email, password });
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
