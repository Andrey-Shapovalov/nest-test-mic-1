import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;
}

export class UpdateUserDto {
  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly email?: string;
}

export class UserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;
}
