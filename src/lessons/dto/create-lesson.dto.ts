import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 1, description: 'Course id' })
  @IsInt()
  courseId: number;

  @ApiProperty({ example: '2026-01-21T10:00:00.000Z', description: 'Lesson date/time (ISO string)' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Intro to SQL', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  topic?: string;
}
