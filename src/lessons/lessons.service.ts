import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new BadRequestException('Course not found');

    return this.prisma.lesson.create({
      data: {
        courseId: dto.courseId,
        date: new Date(dto.date),
        topic: dto.topic,
      },
      include: {
        course: { include: { teacher: true } },
      },
    });
  }

  findAll() {
    return this.prisma.lesson.findMany({
      orderBy: { id: 'asc' },
      include: {
        course: { include: { teacher: true } },
      },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: { include: { teacher: true } },
        attendance: { include: { student: true } },
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(id: number, dto: UpdateLessonDto) {
    await this.findOne(id);

    // якщо прислали date як string — конвертнемо
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);

    // якщо міняють courseId — перевіримо курс
    if (dto.courseId) {
      const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
      if (!course) throw new BadRequestException('Course not found');
    }

    return this.prisma.lesson.update({
      where: { id },
      data,
      include: {
        course: { include: { teacher: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.lesson.delete({ where: { id } });
  }
}
