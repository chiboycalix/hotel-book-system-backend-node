import express from "express";
import { AuthRouter } from "./authRoutes";
import { ListingRouter } from "./listingRoutes";

export class API {
  public static connect() {
    const route = express.Router();
    route.use("/auth", AuthRouter);
    route.use("/listing", ListingRouter)
    return route;
  }
}
