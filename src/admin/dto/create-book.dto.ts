import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BookCategory } from '../../models/book.schema';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Book' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  authorName: string;

  @ApiProperty({ enum: BookCategory, example: BookCategory.FICTION })
  @IsNotEmpty()
  @IsEnum(BookCategory)
  category: BookCategory;

  @ApiProperty({ example: 'A great book about...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Cover image of the book' })
  coverImage: any;

  @ApiProperty({ type: 'string', format: 'binary', description: 'PDF file of the book' })
  pdfFile: any;
}
