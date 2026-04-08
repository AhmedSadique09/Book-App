import { Controller, Get, Post, Query, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users with search and pagination' })
  async getUsers(@Query() query: GetUsersDto) {
    return this.adminService.getUsers(query);
  }

  @Post('books')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'pdfFile', maxCount: 1 },
    ]),
  )
  async createBook(
    @Body() dto: CreateBookDto,
    @UploadedFiles() files: { coverImage?: Express.Multer.File[]; pdfFile?: Express.Multer.File[] },
  ) {
    return this.adminService.createBook(dto, files.coverImage?.[0] as Express.Multer.File, files.pdfFile?.[0] as Express.Multer.File);
  }
}
