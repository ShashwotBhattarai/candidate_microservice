import logger from "../configs/logger.config";
import { CandidateInfo } from "../models/cadidateInfo.model";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function findSavedS3key(acesstoken: string) {
  const current_user_id = await findCurrentuserId(acesstoken);

  try {
    const response = await CandidateInfo.findOne({ user_id: current_user_id });

    if (response instanceof CandidateInfo && response.aws_file_key == null) {
      logger.info("Old file key not found");
      return {
        status: 204,
        message: "old file key not found",
        data: null,
      };
    } else if (
      response instanceof CandidateInfo &&
      response.aws_file_key !== null
    ) {
      logger.info("Old file key found");
      return {
        status: 200,
        message: "old file key found",
        data: response.aws_file_key,
      };
    } else {
      throw new Error("error in findSavedS3key");
    }
  } catch (error) {
    logger.error("Unknown error in findSavedS3key", error);
    throw new Error("error in findSavedS3key");
  }
}
