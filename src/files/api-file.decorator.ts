import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

// add files selector to swagger
export function ApiFile() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1000000 } })),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function ApiFiles() {
  return applyDecorators(
    UseInterceptors(AnyFilesInterceptor({ limits: { fileSize: 1000000 } })),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: 'multipart/form-data',
      required: true,
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
}
