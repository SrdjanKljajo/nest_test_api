import { Module } from '@nestjs/common';
import { FileUploadService } from './files.service';
import { FileController } from './files.controller';

@Module({
  providers: [FileUploadService],
  controllers: [FileController],
})
export class FilesModule {}
