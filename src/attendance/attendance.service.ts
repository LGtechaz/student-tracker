import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: UpsertAttendanceDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: dto.lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const student = await this.prisma.user.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student not found');
    if (String(student.role) !== 'STUDENT') throw new BadRequestException('User is not a STUDENT');

    return this.prisma.attendanceRecord.upsert({
      where: {
        lessonId_studentId: {
          lessonId: dto.lessonId,
          studentId: dto.studentId,
        },
      },
      update: {
        present: dto.present,
        activity: dto.activity,
        note: dto.note ?? null,
      },
      create: {
        lessonId: dto.lessonId,
        studentId: dto.studentId,
        present: dto.present,
        activity: dto.activity,
        note: dto.note ?? null,
      },
    });
  }

  async listByLesson(lessonId: number) {
    return this.prisma.attendanceRecord.findMany({
      where: { lessonId },
      orderBy: [{ studentId: 'asc' }],
      include: {
        student: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async studentSummary(studentId: number, courseId: number) {
    const totalLessons = await this.prisma.lesson.count({ where: { courseId } });

    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        studentId,
        lesson: { courseId },
      },
      select: { present: true, activity: true },
    });

    const presentCount = records.filter((r) => r.present).length;
    const avgActivity = records.length === 0 ? 0 : records.reduce((s, r) => s + r.activity, 0) / records.length;
    const attendancePercent = totalLessons === 0 ? 0 : (presentCount / totalLessons) * 100;

    return {
      studentId,
      courseId,
      totalLessons,
      recordsCount: records.length,
      presentCount,
      attendancePercent: Math.round(attendancePercent * 100) / 100,
      avgActivity: Math.round(avgActivity * 100) / 100,
    };
  }
}
