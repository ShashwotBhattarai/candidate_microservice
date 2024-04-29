/* eslint-disable @typescript-eslint/no-var-requires */
const swaggerAutogen = require("swagger-autogen")();
const dotenv = require("dotenv");
dotenv.config();

const doc = {
  info: {
    title: "Candidate Microservice",
    description: "Candidate Microservice",
    version: "0.0.1",
  },
  host: `localhost:${process.env.PORT}`,
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen(outputFile, routes, doc);
