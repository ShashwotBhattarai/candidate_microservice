import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "../models/jwtPayload.type";

export class UtilsService {
  public findCurrentuserId(accesstoken: string): string {
    const decodedPayload: JWTPayload = jwtDecode(accesstoken);
    const decodedUserId = decodedPayload?.user_id;
    return decodedUserId;
  }
}
