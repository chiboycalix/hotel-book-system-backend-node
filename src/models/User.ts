import { IUser } from "../interfaces/user";
import { Document, Schema, model, Model } from "mongoose";

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "GUEST" },
  },
  { timestamps: true }
);

export const User: any = model<IUserDocument, IUserModel>(
  "User",
  userSchema
);
