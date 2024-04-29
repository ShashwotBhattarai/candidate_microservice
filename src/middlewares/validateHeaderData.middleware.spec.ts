import { ValidateHeaderDataMiddleware } from "./validateHeaderData.middleware";

import express from "express";
import supertest from "supertest";

const validateHeaderDataMiddleware = new ValidateHeaderDataMiddleware();

describe("ValidateHeaderDataFor s3filekey", () => {
  const app = express();
  app.use(express.json());
  app.post(
    "/test",
    validateHeaderDataMiddleware.validateHeaderForKey,
    (req, res) => {
      res.status(200).send("Passed validation");
    },
  );

  it("passes validation if s3filekey is present in header and its type is string", async () => {
    const response = await supertest(app)
      .post("/test")
      .set("s3filekey", "jsfg44jgaf");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("fails validation and returns status:401 and message:Invalid credentials, when no s3filekey header is passed", async () => {
    const response = await supertest(app).post("/test");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

describe("ValidateHeaderDataFor bucket type", () => {
  const app = express();
  app.use(express.json());
  app.post(
    "/test",
    validateHeaderDataMiddleware.validateHeaderForBucketType,
    (req, res) => {
      res.status(200).send("Passed validation");
    },
  );

  it("passes validation if valid bucket is present in header", async () => {
    const response = await supertest(app)
      .post("/test")
      .set("bucket", "default");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("passes validation if valid bucket is present in header", async () => {
    const response = await supertest(app).post("/test").set("bucket", "bad");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("fails validation and returns status:401 and message:Invalid credentials,when no bucket header is passed", async () => {
    const response = await supertest(app).post("/test");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("fails validation and returns status:401 and message:Invalid credentials,when no valid header is passed", async () => {
    const response = await supertest(app).post("/test").set("bucket", "xyz");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});
