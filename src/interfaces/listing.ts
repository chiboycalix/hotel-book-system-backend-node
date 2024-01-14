import { Schema } from "mongoose";

export interface IListing extends Document {
  roomPrice: number;
  roomName: string;
  roomImage: string;
  roomBedType: string;
  roomLocation: string;
}
