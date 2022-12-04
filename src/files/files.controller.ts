import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { FileUploadService } from './files.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { moderator, admin } from '../utils/roleHandler';

@UseGuards(JwtGuard, RolesGuard)
@Controller('/profile-img')
export class FileController {
  constructor(
    private fileUploadService: FileUploadService,
    private prisma: PrismaService,
  ) {}

  @Roles(moderator, admin)
  @Get()
  getAllProfileImages() {
    return this.fileUploadService.getAllProfileImages();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @GetUser('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedFile = await this.fileUploadService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        picture: uploadedFile.fileUrl,
      },
    });

    return user.picture;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) fileId: number) {
    return await this.fileUploadService.deletePublicFile(fileId);
  }
}
