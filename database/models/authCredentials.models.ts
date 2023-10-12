import { Schema, model } from 'mongoose';

const authCredentialsSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const AuthCredentials = model('AuthCredentials', authCredentialsSchema);

