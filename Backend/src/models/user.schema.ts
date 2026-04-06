import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {

    @Prop({ required: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: '' })
    profileImage: string;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

    @Prop({ default: null })
    otp: number;

    @Prop({ default: null })
    otpExpiry: number;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: false })
    isOtpVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
