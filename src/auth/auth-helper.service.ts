import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ITokenPayload } from './interfaces/auth.interface';
import { UserDocument } from '../models/user.schema';

@Injectable()
export class AuthHelperService {
    constructor(private readonly configService: ConfigService) {}

    // JWT Token Generation
    generateToken(user: UserDocument): string {
        const secret = this.configService.get<string>('JWT_SECRET')!;
        return jwt.sign(
            { id: user._id, email: user.email, roles: user.roles },
            secret,
            { expiresIn: '7d' },
        );
    }

    // JWT Token Verification
    verifyToken(token: string): ITokenPayload {
        const secret = this.configService.get<string>('JWT_SECRET')!;
        return jwt.verify(token, secret) as unknown as ITokenPayload;
    }

    // Password Hashing
    hashPassword(password: string): string {
        const saltRounds = Number(this.configService.get<string>('BCRYPT_SALT', '10'));
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    }

    // Password Comparison
    comparePassword(providedPassword: string, storedHashedPassword: string): boolean {
        return bcrypt.compareSync(providedPassword, storedHashedPassword);
    }

    // 6-digit OTP Generation
    generateOTP(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // OTP Expiry Time Generation (returns timestamp)
    generateOTPExpiry(): number {
        const minutes = Number(this.configService.get<string>('OTP_EXPIRATION', '5'));
        return new Date().getTime() + minutes * 60 * 1000;
    }
}
