import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { BookCategory } from '../../models/book.schema';

export class GetBooksDto {
  @ApiPropertyOptional({ description: 'Search by title or author name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: BookCategory, description: 'Filter by category' })
  @IsOptional()
  @IsEnum(BookCategory)
  category?: BookCategory;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
