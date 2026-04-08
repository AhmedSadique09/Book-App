import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { Book, BookSchema } from '../models/book.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
