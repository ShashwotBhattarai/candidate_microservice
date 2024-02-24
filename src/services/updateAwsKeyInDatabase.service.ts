import logger from "../configs/logger.config";
import { CandidateInfo } from "../models/cadidateInfo.model";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function updateAwsKeyInDatabase(
  acesstoken: string,
  newKey: string,
) {
  try {
    const current_user_id = await findCurrentuserId(acesstoken);
    await CandidateInfo.findOneAndUpdate(
      { user_id: current_user_id },
      {
        aws_file_key: newKey,
      },
    );
    logger.info("Aws key updated in database successfully");
    return { status: 200 };
  } catch (error) {
    logger.error("Unknown Error in updateAwsKeyInDatabase", error);
    throw new Error("error in updateAwsKeyInDatabase");
  }
}
