import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { ListingRepository } from "../repositories/listingRepository";
import { successResponse } from "../responses/successResponse";
import { createListingValidateInput } from "../validators/listingValidator";
import { CustomError } from "../exceptions/CustomError";
import { uploadFile } from "../utils/fileUpload";

export class ListingController {
  private listingRepository: ListingRepository;
  constructor({ listingRepository }: { listingRepository: ListingRepository }) {
    this.listingRepository = listingRepository;
  }

  createListing = asyncErrorHandler(
    async (req: Request | any, res: Response, next: NextFunction) => {
      if (!req.file) {
        return next(new CustomError("Please upload an image", 400));
      }
      const validationResult = (await createListingValidateInput(
        req.body
      )) as any;

      if (validationResult?.status === "fail") {
        return next(validationResult);
      }
      const uploadedImageUrl = await uploadFile(req);
      const newListing = {
        roomName: validationResult.roomName,
        roomPrice: validationResult.roomPrice,
        roomLocation: validationResult.roomLocation,
        roomBedType: validationResult.roomBedType,
        roomImage: uploadedImageUrl,
        createdBy: req.user,
      } as any;
      const createdListing = (await this.listingRepository.createListing(
        newListing
      )) as any;
      successResponse(res, createdListing, 201);
    }
  );

  getAllListings = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const listings = (await this.listingRepository.getAllListings()) as any;
      successResponse(res, listings, 200);
    }
  );
}
