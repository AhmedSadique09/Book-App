import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'New username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'Current password (required when changing password)' })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiPropertyOptional({ description: 'New password', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Profile image' })
  @IsOptional()
  profileImage?: any;
}
