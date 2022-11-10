import { CacheKey, Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  @CacheKey('healthcheck')
  @HttpCode(200)
  getHello(): string {
    return 'Healthcheck';
  }
}
