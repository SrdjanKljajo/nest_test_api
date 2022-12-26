import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { FileUploadService } from './files.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { moderator, admin } from '../utils/roleHandler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiFile, ApiFiles } from './api-file.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('/avatar')
@ApiBearerAuth('access_token')
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
  @ApiFile()
  async uploadFile(
    @GetUser('id') userId: number,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return new BadRequestException('Only image files are allowed!');
    } else {
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
  }

  @Post('/upload-files')
  @ApiFiles()
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) fileId: number) {
    return await this.fileUploadService.deletePublicFile(fileId);
  }
}
