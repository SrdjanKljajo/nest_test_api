import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        picture: true,
        bookmarks: true,
      },
    });
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    delete user.hash;

    return user;
  }

  async getUserProfilePicture(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user.picture;
  }

  async adminEditUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return {
      msg: 'User updated successfuly',
      updatedUser: user,
    };
  }
}
