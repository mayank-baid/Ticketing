// This is an abstarct class to standardise or custom errors and give it a template

// Format of errors:
// {
//   errors: {
//     message: string,
//     field?: string
//   }[]
// }

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    // Just to have default behavoiur of throw new Error("message")
    // in out custom error class as well for logging purposes
    super(message);

    // Only beacuse we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
