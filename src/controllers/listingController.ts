import { Request, Response, NextFunction } from "express";
import { IListing } from "../interfaces/listing";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { ListingRepository } from "../repositories/listingRepository";
import { successResponse } from "../responses/successResponse";
import { createListingValidateInput } from "../validators/listingValidator";

export class ListingController {
  private listingRepository: ListingRepository;
  constructor({ listingRepository }: { listingRepository: ListingRepository }) {
    this.listingRepository = listingRepository;
  }

  createListing = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const validationResult = (await createListingValidateInput(
        req.body
      )) as any;
      if (validationResult?.status === "fail") {
        return next(validationResult);
      }

      const newListing = {
        roomName: validationResult.roomName,
        roomPrice: validationResult.roomPrice,
        roomImage: validationResult.roomImage,
        roomLocation: validationResult.roomLocation,
        roomBedType: validationResult.roomBedType,
      } as IListing;
      const createdListing = (await this.listingRepository.createListing(
        newListing
      )) as any;
      successResponse(res, createdListing, 201);
    }
  );
}
