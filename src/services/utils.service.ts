import { jwtDecode } from "jwt-decode";

export class UtilsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public findCurrentuserId(accesstoken: string): string {
    const decodedPayload = jwtDecode(accesstoken) as { user_id: string };
    const decodedUserId = decodedPayload?.user_id;
    return decodedUserId;
  }
}
