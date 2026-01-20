import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    // (не обов’язково, але красиво) перевіряємо, що teacher існує і він TEACHER
    const teacher = await this.prisma.user.findUnique({ where: { id: dto.teacherId } });
    if (!teacher) throw new BadRequestException('Teacher not found');
    if (teacher.role !== 'TEACHER') throw new BadRequestException('User is not a TEACHER');

    return this.prisma.course.create({
      data: {
        title: dto.title,
        teacherId: dto.teacherId,
      },
      include: { teacher: true },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { teacher: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { teacher: true },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    await this.findOne(id);

    // якщо міняємо teacherId — теж перевіримо
    if (dto.teacherId) {
      const teacher = await this.prisma.user.findUnique({ where: { id: dto.teacherId } });
      if (!teacher) throw new BadRequestException('Teacher not found');
      if (teacher.role !== 'TEACHER') throw new BadRequestException('User is not a TEACHER');
    }

    return this.prisma.course.update({
      where: { id },
      data: dto,
      include: { teacher: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.course.delete({ where: { id } });
  }
}
