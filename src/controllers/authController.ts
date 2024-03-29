import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CustomError } from "../exceptions/CustomError";
import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import { successResponse } from "../responses/successResponse";
import { JWT_SECRET } from "../configs/env";
import { sendEmail } from "../utils/emailSender";
import {
  registerUserValidateInput,
  loginUserValidateInput,
} from "../validators/authValidator";
import { EventRepository } from "../repositories/eventRespository";
import { EVENT_TYPES } from "../constants";

export class AuthController {
  private userRepository: UserRepository;
  private eventRepository: EventRepository;
  constructor({
    userRepository,
    eventRepository,
  }: {
    userRepository: UserRepository;
    eventRepository: EventRepository;
  }) {
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  register = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const validationResult = (await registerUserValidateInput(
        req.body
      )) as any;

      if (validationResult?.status === "fail") {
        return next(validationResult);
      }
      const newUser = {
        firstName: validationResult.firstName,
        lastName: validationResult.lastName,
        email: validationResult.email,
        password: validationResult.password,
      } as IUser;
      const foundUser = (await this.userRepository.findUserByEmail(
        newUser.email
      )) as IUser | any;
      if (foundUser) {
        return next(new CustomError("User already exists", 409));
      }

      const hashedPassword = await bcrypt.hash(validationResult.password, 10);
      newUser.password = hashedPassword;
      newUser.role = "GUEST";
      newUser.isVerified = true;
      newUser.isAdmin = false;

      const createdUser = (await this.userRepository.createUser(
        newUser
      )) as any;
      await this.eventRepository.createEvent({
        ...req.body,
        owner: createdUser._id,
        eventName: EVENT_TYPES.USER_CREATED,
        eventData: { ...req.body },
      });
      const token = jwt.sign({ email: createdUser.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      const userWithToken = {
        _id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        IsVerified: createdUser.IsVerified,
        role: createdUser.role,
        token,
      };
      successResponse(res, userWithToken, 201);
    }
  );

  login = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const validationResult = (await loginUserValidateInput(req.body)) as any;
      if (validationResult?.status === "fail") {
        return next(validationResult);
      }

      const foundUser = (await this.userRepository.findUserByEmail(
        validationResult.email
      )) as any;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }

      if(!foundUser.isVerified){
        return next(new CustomError("User not yet verified", 401))
      }

      const isPasswordValid = await bcrypt.compare(
        validationResult.password,
        foundUser.password
      );

      if (!isPasswordValid) {
        return next(new CustomError("Invalid credentials", 401));
      }
      await this.eventRepository.createEvent({
        ...req.body,
        owner: foundUser._id,
        eventName: EVENT_TYPES.USER_LOGGED_IN,
        eventData: { ...req.body },
      });
      const token = jwt.sign({ email: foundUser.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      const userWithToken = {
        _id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        token,
      };
      successResponse(res, userWithToken, 200);
    }
  );

  forgotPassword = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;
      if (!email) {
        return next(new CustomError("Email is required", 400));
      }

      const foundUser = (await this.userRepository.findUserByEmail(
        email
      )) as IUser;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }

      const token = jwt.sign({ email: foundUser.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      sendEmail({
        email,
        token,
        emailType: "forgotPassword",
        subject: "Forget Password",
        username: foundUser.firstName,
      });
      successResponse(res, { message: "Email sent" }, 200);
    }
  );

  resetPassword = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { password, token } = req.body;
      if (!password || !token) {
        return next(new CustomError("Password and token are required", 400));
      }

      const decodedToken = jwt.verify(token, JWT_SECRET) as any;
      const foundUser = (await this.userRepository.findUserByEmail(
        decodedToken.email
      )) as IUser | any;

      if (!foundUser) {
        return next(new CustomError("User not found", 404));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      foundUser.password = hashedPassword;
      await this.userRepository.updateUser(foundUser._id, foundUser);
      successResponse(res, { message: "Password updated" }, 200);
    }
  );
}
