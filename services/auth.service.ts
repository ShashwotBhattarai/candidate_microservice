import { AuthCredentials } from "../database/models/authCredentials.models";
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
}
