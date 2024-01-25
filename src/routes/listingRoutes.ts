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
  "/",
  isAuthorized,
  upload.single('roomImage'),
  listingController.createListing.bind(listingController)
);

ListingRouter.get(
  "/",
  isAuthorized,
  listingController.getAllListings.bind(listingController)
);

ListingRouter.delete(
  "/:id",
  isAuthorized,
  listingController.deleteListingById.bind(listingController)
);