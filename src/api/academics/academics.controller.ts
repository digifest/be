import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { IsPublic } from 'src/shared/decorators/auth.decorators';

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
}
