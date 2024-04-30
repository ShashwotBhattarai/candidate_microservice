import { CandidateInfoValidationMiddleware } from "./candidateInfoValidation.middleware"; // Assuming the file path is correct

import express from "express";
import supertest from "supertest";

const candidateInfoValidation = new CandidateInfoValidationMiddleware();

describe("CandidateInfoValidationMiddleware", () => {
  const app = express();
  app.use(express.json());
  app.post(
    "/test",
    candidateInfoValidation.validateCandidateInfo,
    (req, res) => {
      res.status(200).send("Passed validation");
    },
  );

  it("passes validation for correct candidate data", async () => {
    const response = await supertest(app).post("/test").send({
      fullname: "testUser John",
      email: "babudallay@gmail.com",
      phone_number: "+9779802317570",
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("fails validation and returns status 400 for invalid email", async () => {
    const response = await supertest(app).post("/test").send({
      fullname: "testUser John",
      email: "babudallay",
      phone_number: "+9779802317570",
    });

    expect(response.statusCode).toBe(400);
  });

  it("fails validation and returns status 400 for invalid phone number", async () => {
    const response = await supertest(app).post("/test").send({
      fullname: "testUser John",
      email: "babudallay",
      phone_number: "+9779802317570000000000000000",
    });

    expect(response.statusCode).toBe(400);
  });

  it("fails validation and returns status 400 for invalid fullname", async () => {
    const response = await supertest(app).post("/test").send({
      fullname: "testUser John 1",
      email: "babudallay",
      phone_number: "+9779802317570",
    });

    expect(response.statusCode).toBe(400);
  });
});
