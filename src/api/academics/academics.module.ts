import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { College, CollegeSchema } from './schemas/college.schema';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { AcademicsController } from './academics.controller';
import { AcademicsService } from './academics.service';
import { Course, CourseSchema } from './schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: College.name,
        schema: CollegeSchema,
      },
      {
        name: Department.name,
        schema: DepartmentSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
  controllers: [AcademicsController],
  providers: [AcademicsService],
  exports: [MongooseModule, AcademicsService],
})
export class AcademicsModule {}
