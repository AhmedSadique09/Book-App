import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { Book } from '../models/book.schema';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getUsers(query: GetUsersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { roles: { $ne: 'admin' } };

    if (query.search) {
      filter.$or = [
        { username: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('username email profileImage createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createBook(
    dto: CreateBookDto,
    coverImage: Express.Multer.File,
    pdfFile: Express.Multer.File,
  ) {
    if (!coverImage || !pdfFile) {
      throw new BadRequestException('Cover image and PDF file are required');
    }

    const [coverResult, pdfResult] = await Promise.all([
      this.cloudinaryService.uploadImage(coverImage),
      this.cloudinaryService.uploadImage(pdfFile),
    ]);

    const book = await this.bookModel.create({
      ...dto,
      coverImage: coverResult.secure_url,
      pdfUrl: pdfResult.secure_url,
    });

    return book;
  }
}
