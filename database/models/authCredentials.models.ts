import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const authCredentialsSchema = new Schema({
  user_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role:{ type: String, default: "user"}
});

export const AuthCredentials = model('AuthCredentials', authCredentialsSchema);

