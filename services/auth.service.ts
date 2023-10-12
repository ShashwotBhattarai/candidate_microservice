import { AuthCredentials } from "../database/models/authCredentials.models";
import jwt from "jsonwebtoken";

export class AuthService {
  async registerNewUser(
    newFullname: string,
    newEmail: string,
    newUsername: string,
    newPassword: string
  ) {
    try {
      const result = await AuthCredentials.findOne({ username: newUsername });
      if (result == null) {
        const registerNewUser = new AuthCredentials({
          fullname: newFullname,
          email: newEmail,
          username: newUsername,
          password: newPassword,
        });
        await registerNewUser.save();
        return {
          status: 201,
          message: "New user registered",
        };
      } else {
        return {
          status: 400,
          message: "username already exists",
        };
      }
    } catch (error) {
      throw {
        status: 500,
        message: error,
      };
    }
  }
  async login(loginUsername: string, loginPassword: string) {
    try {
      const result = await AuthCredentials.findOne({ username: loginUsername });

      if (result !== null && loginPassword == result.password) {
        const token = jwt.sign(
          { username: loginUsername, password: loginPassword },
          "YOUR_SECRETrefrerfre",
          {
            expiresIn: "1d",
          }
        );

        return {
          status: 200,
          message: `token: ${token}`,
        };
      } else {
        return {
          status: 401,
          message: "please check your username and password",
        };
      }
    } catch (error) {
      throw {
        status: 500,
        message: error,
      };
    }
  }
}
