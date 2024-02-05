export class CustomError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "Internal Server Error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}