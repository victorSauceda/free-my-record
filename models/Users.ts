import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: Date;
  isVerified: boolean;
}

const userSchema: Schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  isVerified: Boolean,
});

export default mongoose.models.Users ||
  mongoose.model<IUser>('Users', userSchema);
