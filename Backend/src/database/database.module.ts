import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProvider } from './database.provider';

@Module({
    imports: [MongooseModule.forRootAsync(databaseProvider)],
})
export class DatabaseModule {}