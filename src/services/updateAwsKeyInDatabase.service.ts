import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function updateAwsKeyInDatabase(acesstoken: string, newKey: string) {
	try {
		const current_user_id = await findCurrentuserId(acesstoken);
		await CandidateInfo.findOneAndUpdate(
			{ user_id: current_user_id },
			{
				aws_file_key: newKey,
			}
		);

		return { status: 200 };
	} catch (error) {
		throw new Error("error in updateAwsKeyInDatabase");
	}
}
