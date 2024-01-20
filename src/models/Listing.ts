import { IListing } from "../interfaces/listing";
import { Document, Schema, model, Model } from "mongoose";

export interface IListingDocument extends IListing, Document {}
export type IListingModel = Model<IListingDocument>;

const listingSchema = new Schema(
  {
    roomName: { type: String, required: true },
    roomPrice: { type: Number, required: true },
    roomImage: { type: String, required: true },
    roomBedType: { type: String, required: true },
    roomLocation: { type: String, required: true },
    createdBy: { type: String, ref: "User" },
  },

  { timestamps: true }
);

export const Listing: any = model<IListingDocument, IListingModel>(
  "Listing",
  listingSchema
);
