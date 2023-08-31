import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: Date;
  isVerified: boolean;
}

const userSchema: Schema = new mongoose.Schema({
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
