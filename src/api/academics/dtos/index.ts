import { IsNumber, IsString } from 'src/shared/decorators';

export class CreateCourseDto {
  @IsString(false)
  name: string;

  @IsString(false)
  course_code: string;

  @IsString(false)
  department: string;

  @IsNumber(false)
  semester_index: number;

  @IsNumber(false)
  level: number;
}
