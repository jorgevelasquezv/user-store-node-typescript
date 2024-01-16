import mongoose from 'mongoose';
import { bcryptAdapter } from '../../../config';

interface IUser extends Document {
    name: string;
    email: string;
    emailVerified: boolean;
    password: string;
    img?: string;
    roles: string[];
    encryptPassword(password: string): Promise<string>;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: [true, 'Name is required'] },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String },
    roles: {
        type: [String],
        default: ['USER_ROLE'],
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
    },
});

userSchema.methods.encryptPassword = function (password: string) {
    return bcryptAdapter.hash(password);
}

userSchema.methods.comparePassword = function (password: string) {
    return bcryptAdapter.compare(password, this.password);
}

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    },
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
