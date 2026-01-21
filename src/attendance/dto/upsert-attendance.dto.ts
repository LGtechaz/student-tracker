import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpsertAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  lessonId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  studentId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  present: boolean;

  @ApiProperty({ example: 7, minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  activity: number;

  @ApiProperty({ example: 'Was active in discussion', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
