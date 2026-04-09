import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../models/book.schema';
import { GetBooksDto } from './dto/get-books.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async getBooks(query: GetBooksDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { authorName: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.category) {
      filter.category = query.category;
    }

    const [books, total] = await Promise.all([
      this.bookModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.bookModel.countDocuments(filter),
    ]);

    return {
      books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

}
