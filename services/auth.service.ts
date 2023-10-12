import { AuthCredentials } from "../database/models/authCredentials.models";
export class AuthService {
  async registerNewUser(
    newFullname: string,
    newEmail: string,
    newUsername: string,
    newPassword: string
  ) {

    console.log(newFullname,newEmail,newUsername,newPassword);

    const registerNewUser = new AuthCredentials({
      fullname: newFullname,
      email: newEmail,
      username: newUsername,
      password: newPassword,
    });

    try{
        await registerNewUser.save();
        return {
            "message": "New user registered"
        }

    }catch(error){
        throw error;

    }
    
  }
}
