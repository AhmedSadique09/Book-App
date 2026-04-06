import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({ example: 'ahmed@gmail.com' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 123456 })
    @IsNotEmpty({ message: 'OTP is required' })
    @IsNumber({}, { message: 'OTP must be a number' })
    otp: number;
}
