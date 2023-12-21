import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";

export async function findSavedS3key(acesstoken: string) {
	const current_user_id = await findCurrentuserId(acesstoken);

	try {
		const response = await CandidateInfo.findOne({ user_id: current_user_id });

		if (response instanceof CandidateInfo && response.aws_file_key == null) {
			return {
				status: 204,
				message: "old file key not found",
				data: null,
			};
		} else if (response instanceof CandidateInfo && response.aws_file_key !== null) {
			return {
				status: 200,
				message: "old file key found",
				data: response.aws_file_key,
			};
		} else {
			return {
				status: 500,
				message: "unexpected error",
				data: null,
			};
		}
	} catch (error) {
		return {
			status: 500,
			message: "database error",
			data: error,
		};
	}
}
