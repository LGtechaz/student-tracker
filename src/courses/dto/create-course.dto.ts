import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Databases' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 1, description: 'Teacher user id' })
  @IsInt()
  teacherId: number;
}
