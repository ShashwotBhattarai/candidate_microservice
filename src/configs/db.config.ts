import mongoose from "mongoose";
import * as dotenv from "dotenv";
import logger from "./logger.config";

dotenv.config();

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(process.env.DATABASEURI as string);
    logger.info("Connected to the database");
  } catch (error) {
    logger.error(`Error connecting to the database.`, error);
  }
}

export default connectToDatabase;
