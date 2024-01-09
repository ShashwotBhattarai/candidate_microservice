import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function connectToDatabase(): Promise<void> {
	try {
		await mongoose.connect(process.env.DATABASEURI as string);
		console.log("Connected to the database");
	} catch (error) {
		console.log(error);
	}
}

export default connectToDatabase;
