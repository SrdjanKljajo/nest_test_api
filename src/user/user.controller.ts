import {
  Body,
  CacheKey,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { User } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { moderator, admin } from 'src/utils/roleHandler';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard, RolesGuard)
@Throttle(3, 10) // custom rate limit for route - 3 req in 10 sec
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  // if you want one item ( it is posible because of [data] in custom decorator)
  /*getMe(@GetUser('email') user: string) {
    return user;
  }*/

  @Roles(moderator, admin)
  @Get()
  @CacheKey('users')
  getUsers() {
    return this.userService.getUsers();
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Roles(moderator, admin)
  @Patch(':id')
  adminEditUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.adminEditUser(userId, dto);
  }
}
