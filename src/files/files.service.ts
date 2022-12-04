import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(dataBuffer: Buffer, fileName: string, mimetype: any) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
        ContentType: mimetype,
      })
      .promise();

    const fileStorageInDB = {
      fileName: fileName,
      fileUrl: uploadResult.Location,
      key: uploadResult.Key,
    };

    const filestored = await this.prismaService.publicFile.create({
      data: fileStorageInDB,
    });

    return filestored;
  }

  getAllProfileImages() {
    return this.prismaService.publicFile.findMany({});
  }

  async deletePublicFile(fileId: number) {
    const file = await this.prismaService.publicFile.findUnique({
      where: {
        id: fileId,
      },
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.prismaService.publicFile.delete({
      where: {
        id: fileId,
      },
    });
  }
}
