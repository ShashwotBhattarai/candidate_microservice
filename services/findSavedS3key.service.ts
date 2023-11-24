import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function findSavedS3key(acesstoken: string) {
  const current_user_id = findCurrentuserId(acesstoken);

  try {
    const response = await CandidateInfo.findOne({ user_id: current_user_id });
    console.log(response);
    return {
      status: 200,
      key: response?.aws_file_key,
      message: "old file key found",
    };
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
}
