import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function saveUserDetailsToDatabase(
  file: any,
  body: any,
  acesstoken: string
) {
  const current_user_id = findCurrentuserId(acesstoken);

  try {
    const response = await CandidateInfo.findOneAndUpdate(
      { user_id: current_user_id },
      {
        fullname: body.fullname,
        email: body.email,
        phone_number: body.phone_number,
        local_file_name: file?.filename,
        file_size_in_bytes: file?.size,
      },
      { upsert: true, new: true }
    );

    return { status: 201, message: "User info Saved to database" };
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
}

export async function updateAwsKeyInDatabase(
  acesstoken: string,
  newKey: string
) {
  const current_user_id = findCurrentuserId(acesstoken);

  try {
    const response = await CandidateInfo.findOneAndUpdate(
      { user_id: current_user_id },
      {
        aws_file_key: newKey,
      }
    );

    return { status: 200, message: "new file key saved to database" };
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
}
