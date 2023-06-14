import { Inject, Injectable } from '@nestjs/common';
import { UserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';

import { UserQueryDto } from './dto/query.dto';

@Injectable()
export class UsersService {
  private nextUserId = 1;
  private users: UserDto[] = [];

  async getAllUsers(userQueryDto: UserQueryDto): Promise<UserDto[]> {
    return this.users;
  }

  getUserById(id: number): UserDto {
    return this.users.find((user) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto): UserDto {
    const newUser: UserDto = {
      id: this.nextUserId,
      ...createUserDto,
    };
    this.users.push(newUser);
    this.nextUserId++;
    return newUser;
  }

  deleteUser(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
