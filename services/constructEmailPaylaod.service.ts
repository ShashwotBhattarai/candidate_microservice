import { CandidateInfo } from "../database/models/cadidateInfo.models";
import { findCurrentuserId } from "./findCurrentUserId.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";

export class ConstructEmailPayload {
	async constructEmailPayload(currentUserToken: string, subject: string, text: string) {
		const user_id = findCurrentuserId(currentUserToken);

		let namedSubject;

		try {
			const response = await CandidateInfo.findOne({ user_id: user_id });
			const email = response?.email;
			const fullname = response?.fullname;

			namedSubject = "Hi " + fullname + " " + subject;

			const emailPayload: EmailPayload = {
				to: email || "",
				subject: namedSubject,
				text: text,
			};
			return { status: 200, message: emailPayload };
		} catch (error) {
			return {
				status: 500,
				message: error,
			};
		}
	}
}
