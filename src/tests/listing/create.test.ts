import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
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
    expect(response.body.message).toBe("Unauthorized access");
    expect(response.body.error.status).toBe("fail");
    expect(response.body.error.isOperational).toBe(true);
  });

  it("should return 400 bad request if a required field is missing", async () => {
    const response = await request(app)
      .post(`${baseUrl}/listing/create`)
      .send({
        roomName: "Deluxe Room",
        roomLocation: "New York",
        roomPrice: 300,
        roomBedType: "Single",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Please upload an image");
    expect(response.body.error.status).toBe("fail");
    expect(response.body.error.isOperational).toBe(true);
  });

  it("should return 400 for Joi validation error", async () => {
    const response = await request(app)
      .post(`${baseUrl}/listing/create`)
      .field("roomName", "Deluxe Room")
      .field("roomLocation", "New York")
      .field("roomPrice", 300)
      .attach("roomImage", "src/tests/listing/testImage.png")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('"roomBedType" is required');
  });

  it("should return 201 if all parameters are provided", async () => {
    const response = await request(app)
      .post(`${baseUrl}/listing/create`)
      .field("roomName", "Deluxe Room")
      .field("roomLocation", "New York")
      .field("roomPrice", 300)
      .field("roomBedType", "Single")
      .attach("roomImage", "src/tests/listing/testImage.png")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.createdBy).toBe("test@example.com");
    expect(response.body.data.roomName).toBe("Deluxe Room");
    expect(response.body.data.roomLocation).toBe("New York");
    expect(response.body.data.roomPrice).toBe(300);
    expect(response.body.data.roomBedType).toBe("Single");
  });
});