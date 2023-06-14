import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UserQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public offset?: string;
}
