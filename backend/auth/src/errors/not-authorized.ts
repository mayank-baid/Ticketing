import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;

  constructor() {
    super("Route not found");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}
