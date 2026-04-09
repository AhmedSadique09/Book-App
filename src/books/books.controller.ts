import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { GetBooksDto } from './dto/get-books.dto';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books with search, category filter and pagination' })
  async getBooks(@Query() query: GetBooksDto) {
    return this.booksService.getBooks(query);
  }

}
