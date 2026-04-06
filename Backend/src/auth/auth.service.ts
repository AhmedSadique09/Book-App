import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { AuthHelperService } from './auth-helper.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { errorHandler } from '../common/utils/error.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authHelper: AuthHelperService,
  ) {}

  // Signup
  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    try {
      const { username, email, password, profileImage } = signupDto;

      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw errorHandler(
          HttpStatus.CONFLICT,
          'User already exists',
          'Email already registered',
        );
      }

      const hashedPassword = this.authHelper.hashPassword(password);
      const otp = this.authHelper.generateOTP();
      const otpExpiry = this.authHelper.generateOTPExpiry();

      const newUser = new this.userModel({
        username,
        email,
        password: hashedPassword,
        profileImage: profileImage || '',
        otp,
        otpExpiry,
        isVerified: false,
      });

      await newUser.save();

      return { message: 'Signup successful. Please verify your OTP' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during signup', (error as Error).message);
    }
  }

  // Verify OTP (works for both signup verification and forgot password)
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string; token?: string; user?: any }> {
    try {
      const { email, otp } = verifyOtpDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw errorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }

      if (user.otp !== otp) {
        throw errorHandler(HttpStatus.BAD_REQUEST, 'Invalid OTP');
      }

      if (user.otpExpiry < new Date().getTime()) {
        throw errorHandler(HttpStatus.BAD_REQUEST, 'OTP has expired');
      }

      user.otp = null as any;
      user.otpExpiry = null as any;

      // Signup verification - generate token
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();

        const token = this.authHelper.generateToken(user);
        const { password: _, otp: __, otpExpiry: ___, ...userData } = user.toObject();

        return { message: 'OTP verified successfully', token, user: userData };
      }

      // Forgot password verification - no token, just mark otp verified
      user.isOtpVerified = true;
      await user.save();
      return { message: 'OTP verified successfully. You can now reset your password' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during OTP verification', (error as Error).message);
    }
  }

  // Signin
  async signin(signinDto: SigninDto): Promise<{ message: string; token?: string; user?: any }> {
    try {
      const { email, password } = signinDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw errorHandler(
          HttpStatus.UNAUTHORIZED,
          'Invalid credentials',
          'Email not found',
        );
      }

      const isPasswordValid = this.authHelper.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw errorHandler(
          HttpStatus.UNAUTHORIZED,
          'Invalid credentials',
          'Password mismatch',
        );
      }

      if (!user.isVerified) {
        return { message: 'User login successfully - Email verification required' };
      }

      const token = this.authHelper.generateToken(user);
      const { password: _, otp: __, otpExpiry: ___, ...userData } = user.toObject();

      return { message: 'User login successfully', token, user: userData };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during signin', (error as Error).message);
    }
  }

  // Forgot Password - Send OTP
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      const { email } = forgotPasswordDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw errorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }

      const otp = this.authHelper.generateOTP();
      const otpExpiry = this.authHelper.generateOTPExpiry();

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      return { message: 'OTP sent to your email for password reset' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during forgot password', (error as Error).message);
    }
  }

  // Resend OTP
  async resendOtp(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      const { email } = forgotPasswordDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw errorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }

      const otp = this.authHelper.generateOTP();
      const otpExpiry = this.authHelper.generateOTPExpiry();

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      return { message: 'OTP resent successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during resend OTP', (error as Error).message);
    }
  }

  // Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const { email, newPassword } = resetPasswordDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw errorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }

      if (!user.isOtpVerified) {
        throw errorHandler(HttpStatus.FORBIDDEN, 'Please verify your OTP before resetting password');
      }

      user.password = this.authHelper.hashPassword(newPassword);
      user.isOtpVerified = false;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during password reset', (error as Error).message);
    }
  }

  // Find user by ID
  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }
}
