import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum UserRoleDto {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Ivan Petrenko' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'ivan@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRoleDto, example: UserRoleDto.STUDENT })
  @IsEnum(UserRoleDto)
  role: UserRoleDto;
}
