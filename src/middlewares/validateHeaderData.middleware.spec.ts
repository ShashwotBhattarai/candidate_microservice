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

  it("when no header is passed", async () => {
    const response = await supertest(app).post("/test");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("s3filekey header missing");
  });
});

describe("ValidateHeaderDataFor buckettype", () => {
  const app = express();
  app.use(express.json());
  app.post(
    "/test",
    validateHeaderDataMiddleware.validateHeaderForBucketType,
    (req, res) => {
      res.status(200).send("Passed validation");
    },
  );

  it("passes validation if bucket is present in header", async () => {
    const response = await supertest(app)
      .post("/test")
      .set("bucket", "default");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("when no header is passed", async () => {
    const response = await supertest(app).post("/test");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("bucket header missing");
  });
});
