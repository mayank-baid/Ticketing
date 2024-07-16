import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// Modifying existing interface without extend
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// Make two middlewares for checking if the user is logged in:
//   1. To extract the jwt payload and set it on "req.currentUser"
//   2. To reject the request if the user is not logged in

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get jwt from cookie, validate, if correct then return user data
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) {}
  next();
};
