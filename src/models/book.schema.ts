import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BookCategory {
  FICTION = 'fiction',
  SCIENCE = 'science',
  TECHNOLOGY = 'technology',
  HISTORY = 'history',
  BIOGRAPHY = 'biography',
  BUSINESS = 'business',
  POETRY = 'poetry',
  EDUCATION = 'education',
  CHILDREN = 'children',
}

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true, enum: BookCategory })
  category: BookCategory;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  coverImage: string;

  @Prop({ required: true })
  pdfUrl: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
