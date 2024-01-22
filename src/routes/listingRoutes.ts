import express from "express";
import { ListingController } from "../controllers/listingController";
import { ListingRepository } from "../repositories/listingRepository";
import { Listing } from "../models/Listing";
import { isAuthorized } from "../middlewares/isAuthorized";
import { upload } from "../configs/multer";

export const ListingRouter = express.Router();
const listingRepository = new ListingRepository({ listingModel: Listing });

const listingController = new ListingController({ listingRepository });

ListingRouter.post(
  "/create",
  isAuthorized,
  upload.single('roomImage'),
  listingController.createListing.bind(listingController)
);

ListingRouter.get(
  "/all",
  isAuthorized,
  listingController.getAllListings.bind(listingController)
);