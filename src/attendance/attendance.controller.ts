import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  upsert(@Body() dto: UpsertAttendanceDto) {
    return this.attendanceService.upsert(dto);
  }

  @Get('lesson/:lessonId')
  listByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.attendanceService.listByLesson(lessonId);
  }

  @Get('student/:studentId/summary')
  studentSummary(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.attendanceService.studentSummary(studentId, courseId);
  }
}
