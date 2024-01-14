import Joi from "joi";
import { CustomError } from "exceptions/CustomError";

export const createListingSchema = Joi.object({
  roomName: Joi.string().required(),
  roomPrice: Joi.number().required(),
  roomImage: Joi.string().required(),
  roomLocation: Joi.string().email().required(),
  roomBedType: Joi.string().min(2).required(),
});

export const createListingValidateInput = (data: any) => {
  const { error, value } = createListingSchema.validate(data);
  if (error) {
    const errorMessage = error.details
      .map((detail: { message: string }) => detail.message)
      .join(", ");
    return new CustomError(errorMessage, 400);
  }
  return value;
};
