import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelperService } from './auth-helper.service';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CloudinaryModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthHelperService],
    exports: [AuthHelperService, AuthService],
})
export class AuthModule {}
