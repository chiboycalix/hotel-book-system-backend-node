import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import { JWT_SECRET } from "../../configs/env";
import { User } from "../../models/User";
import { Listing } from "../../models/Listing";

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

    await Listing.create({
      roomName: "Deluxe Room",
      roomLocation: "New York",
      roomPrice: 300,
      roomBedType: "Single",
      roomImage: "https://res.cloudinary.com/djksghat4/i",
      createdBy: user.email,
    });

    await Listing.create({
      roomName: "Deluxe Room",
      roomLocation: "New York",
      roomPrice: 300,
      roomBedType: "Single",
      roomImage: "https://res.cloudinary.com/djksghat4/i",
      createdBy: user.email,
    });

    owner = user.email;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Listing.deleteMany({});
  });

  it("should return 401 unauthorized if a authentication token is missing", async () => {
    const response = await request(app).get(`${baseUrl}/listing/all`);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized access");
    expect(response.body.error.status).toBe("fail");
    expect(response.body.error.isOperational).toBe(true);
  });

  it("should return 200 ok if a authentication token is valid", async () => {
    const response = await request(app)
      .get(`${baseUrl}/listing/all`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.success).toBe(true);
  });
});
