import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function saveUserDetailsToDatabase(
  file: any,
  body: any,
  acesstoken: string
) {
  const current_user_id = findCurrentuserId(acesstoken);
  const cadidateInfo = new CandidateInfo({
    user_id: current_user_id,
    fullname: body.fullname,
    email: body.email,
    phone_number: body.phone_number,
    local_file_name: file?.filename,
    file_size_in_bytes: file?.size,
  });

  try {
    await cadidateInfo.save();
    return { status: 201, message: "User info Saved to database" };
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
}
