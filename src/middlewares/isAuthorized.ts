import { jwtDecode } from "jwt-decode";
import { CustomError } from "../exceptions/CustomError";
import { NextFunction,Request,Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export const isAuthorized = (req: Request | any, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"] as string;
  if (!authorizationHeader) {
    return next(new CustomError("Unauthorized access", 401))
  }
  const token = authorizationHeader?.split(" ")[1];
  if (!token) {
    return next(new CustomError("Please provide auth token", 401))
  }
  const decodedToken = jwtDecode<JwtPayload>(token);
  if (!decodedToken) {
    return next(new CustomError("Invalid token", 401))
  }
  const tokenExpiration = decodedToken.exp;
  const dateNow = new Date();
  if (tokenExpiration && tokenExpiration < dateNow.getTime()/1000) {
    return next(new CustomError("Token expired", 401))
  }
  req.user = decodedToken.email;
  return next();
}
