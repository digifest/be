import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { IsPublic, Roles } from 'src/shared/decorators/auth.decorators';
import { RoleNames } from '../user/enums';
import { CreateCourseDto } from './dtos';

@Controller('academics')
@ApiTags('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('college')
  @IsPublic()
  async getColleges() {
    return await this.academicsService.getColleges();
  }

  @Get('college/:college_id/department')
  @IsPublic()
  async getDepts(@Param('college_id') college_id: string) {
    return await this.academicsService.getDepts(college_id);
  }

  @Get('department')
  @IsPublic()
  async getAllDepts() {
    return await this.academicsService.getAllDepts();
  }

  @Get('course')
  @IsPublic()
  async getCourses(@Query('department_id') department_id: string) {
    return await this.academicsService.getCourses(department_id);
  }

  @Get('course')
  @Roles([RoleNames.Admin])
  async createCourse(@Body() body: CreateCourseDto) {
    return await this.academicsService.createCourse(body);
  }
}
