import { Model } from "mongoose";
import { IListing } from "../interfaces/listing";

export class ListingRepository {
  private listingModel: Model<IListing>;
  constructor({ listingModel }: { listingModel: Model<IListing> }) {
    this.listingModel = listingModel;
  }
  async createListing(listing: IListing): Promise<IListing> {
    return this.listingModel.create(listing);
  }
  async getAllListings(): Promise<IListing[]> {
    return this.listingModel.find();
  }
  async deleteListingById(id: string): Promise<IListing> {
    return this.listingModel.findByIdAndDelete(id);
  }
}