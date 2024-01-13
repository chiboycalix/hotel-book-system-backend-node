import Joi from "joi";
import { CustomError } from "../exceptions/CustomError";

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
});

export const registerUserValidateInput = (data: any) => {
  const { error, value } = registerSchema.validate(data);
  return genericResponse(error, value);
};

export const loginUserValidateInput = (data: any) => {
  const { error, value } = loginSchema.validate(data);
  return genericResponse(error, value);
};

const genericResponse = (error: {details:any}, value: any) => {
  if (error) {
    const errorMessage = error.details
      .map((detail: {message: string }) => detail.message)
      .join(", ");
    return new CustomError(errorMessage, 400);
  }
  return value;
}