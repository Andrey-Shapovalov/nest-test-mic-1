import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GrpcMethod } from '@nestjs/microservices';
import { GetAllUsersRequest, GetAllUsersResponse, USERS_SERVICE_NAME, User } from 'protorepo-users-nestjs';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { UserQueryDto } from './dto/query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all or filtered users',
    type: [UserDto],
  })
  async getAllUsers(@Query() userQueryDto: UserQueryDto): Promise<UserDto[]> {
    return this.usersService.getAllUsers(userQueryDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: number): Promise<void> {
    this.usersService.deleteUser(id);
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'GetAllUsers')
  async findUsers(data: GetAllUsersRequest, metadata: unknown): Promise<GetAllUsersResponse> {
    const allUsers = await this.usersService.getAllUsers(data);
    return { users: allUsers.map(user => ({
      user_id: user.id,
      name: user.name,
      email: user.email
    })) }
  }

}
