import { AuthCredentials } from "../database/models/authCredentials.models";
import jwt from "jsonwebtoken";

export class AuthService {
  async registerNewUser(
    newEmail: string,
    newUsername: string,
    newPassword: string,
    newRole: string
  ) {
    try {
      const result = await AuthCredentials.findOne({ username: newUsername });
      if (result == null) {
        const registerNewUser = new AuthCredentials({
          email: newEmail,
          username: newUsername,
          password: newPassword,
          role: newRole,
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
      return {
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
          {
            user_id: result.user_id,
            username: loginUsername,
            role: result.role,
          },
          process.env.JWTSECRET as string,
          {
            expiresIn: "1d",
          }
        );

        return {
          status: 200,
          message: { token: token },
        };
      } else {
        return {
          status: 401,
          message: "please check your username and password",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  }
}
