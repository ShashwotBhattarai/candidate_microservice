import { UtilsService } from "./utils.service";
import { JWTPayload } from "../models/jwtPayload.type";
import * as jwtdecodeModule from "jwt-decode";

describe("UtilsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findCurrentuserId", () => {
    it("should return the user ID from the decoded JWT payload", () => {
      const accessToken = "fake_access_token";
      const decodedPayload: JWTPayload = { user_id: "fake_user_id" };

      const jwtdecodeSpy = jest.spyOn(jwtdecodeModule, "jwtDecode");
      jwtdecodeSpy.mockReturnValue(decodedPayload);

      const utilsService = new UtilsService();
      const userId = utilsService.findCurrentuserId(accessToken);

      expect(userId).toBe(decodedPayload.user_id);
    });

    it("should return undefined if the JWT payload is invalid", () => {
      const accessToken = "fake_access_token";

      const jwtdecodeSpy = jest.spyOn(jwtdecodeModule, "jwtDecode");
      jwtdecodeSpy.mockReturnValue(undefined);

      const utilsService = new UtilsService();
      const userId = utilsService.findCurrentuserId(accessToken);

      expect(userId).toBeUndefined();
    });
  });
});
