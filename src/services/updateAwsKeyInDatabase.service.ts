import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function updateAwsKeyInDatabase(acesstoken: string, newKey: string) {
	const current_user_id = await findCurrentuserId(acesstoken);
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
