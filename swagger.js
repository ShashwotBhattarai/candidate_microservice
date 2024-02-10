const swaggerAutogen = require("swagger-autogen")();

const doc = {
	info: {
		title: "My API",
		description: "Description",
	},
	host: "localhost:4000",
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen(outputFile, routes, doc);
