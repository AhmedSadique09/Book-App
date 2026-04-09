/// <reference types="multer" />
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { AuthHelperService } from '../auth/auth-helper.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { errorHandler } from '../common/utils/error.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authHelper: AuthHelperService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw errorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }

      // Update username
      if (dto.username) {
        user.username = dto.username;
      }

      // Update profile image
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        user.profileImage = uploadResult.secure_url;
      }

      // Update password
      if (dto.newPassword) {
        if (!dto.currentPassword) {
          throw errorHandler(HttpStatus.BAD_REQUEST, 'Current password is required to set a new password');
        }

        const isMatch = this.authHelper.comparePassword(dto.currentPassword, user.password);
        if (!isMatch) {
          throw errorHandler(HttpStatus.BAD_REQUEST, 'Current password is incorrect');
        }

        user.password = this.authHelper.hashPassword(dto.newPassword);
      }

      await user.save();

      const { password: _, otp: __, otpExpiry: ___, ...userData } = user.toObject();

      return { message: 'Profile updated successfully', user: userData };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw errorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong during profile update', (error as Error).message);
    }
  }
}
