import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  studentId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  courseId: number;
}
