import { CustomError } from "../exceptions/CustomError";
import { NextFunction,Request,Response } from "express";

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"] as string;
  if (!authorizationHeader) {
    return next(new CustomError("Unauthorized access", 401))
  }
  const token = authorizationHeader?.split(" ")[1];
  if (!token) {
    return next(new CustomError("Please provide auth token", 401))
  }
  return next();
}