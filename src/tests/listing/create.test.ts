import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import { Listing } from "../../models/Listing";
import { JWT_SECRET } from "../../configs/env";
import { User } from "../../models/User";

const baseUrl = "/api/v1";

describe("Create Listing Function", () => {
  const testEmail = "test@example.com";
  const token = jwt.sign({ email: testEmail }, JWT_SECRET, {
    expiresIn: "1d",
  });

  let owner: any;
  beforeEach(async () => {
    const user = await User.create({
      firstName: "Jane",
      lastName: "Doe",
      password: "Password123",
      email: testEmail,
    });

    owner = user.email;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return 401 unauthorized if a authentication token is missing", async () => {
    const response = await request(app).post(`${baseUrl}/listing/create`).send({
      roomName: "Deluxe Room",
      roomLocation: "New York",
      roomPrice: 300,
      roomBedType: "Single",
      roomImage: "https://res.cloudinary.com/djksghat4/i",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized access');
    expect(response.body.error.status).toBe('fail');
    expect(response.body.error.isOperational).toBe(true);
  });

  it("should return 400 bad request if a required field is missing", async () => {
    const response = await request(app).post(`${baseUrl}/listing/create`).send({
      roomName: "Deluxe Room",
      roomLocation: "New York",
      roomPrice: 300,
      roomBedType: "Single",
    }).set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("\"roomImage\" is required");
    expect(response.body.error.status).toBe('fail');
    expect(response.body.error.isOperational).toBe(true);
  });

  it("should return 201 if all parameters are provided", async () => {
    const response = await request(app).post(`${baseUrl}/listing/create`).send({
      roomName: "Deluxe Room",
      roomLocation: "New York",
      roomPrice: 300,
      roomBedType: "Single",
      roomImage: "https://res.cloudinary.com/djksghat4/i",
      createdBy: owner,
    }).set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
  });

});