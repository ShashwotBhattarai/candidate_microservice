import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function saveUserDetailsToDatabase(file: any, body: any, acesstoken: string) {
	try {
		const current_user_id = await findCurrentuserId(acesstoken);
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

		return { status: 200 };
	} catch (error) {
		throw new Error("error in saveUserDetailsToDatabase");
	}
}
