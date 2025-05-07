import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { College } from './schemas/college.schema';
import { Model } from 'mongoose';
import { Department } from './schemas/department.schema';
import { COLLEGES_AND_DEPARTMENTS } from './seeds';

@Injectable()
export class AcademicsService {
  private readonly _logger: Logger;

  constructor(
    @InjectModel(College.name)
    private readonly collegeModel: Model<College>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {
    this._logger = new Logger(AcademicsService.name);
    this.seedColleges();
  }

  async getColleges() {
    const data = await this.collegeModel.find({}).sort({ name: -1 });

    return {
      message: 'Colleges fetched',
      success: true,
      data,
    };
  }

  async getDepts(college_id: string) {
    const data = await this.departmentModel
      .find({ college: college_id })
      .sort({ name: -1 });

    return {
      message: 'Departments fetched',
      success: true,
      data,
    };
  }

  async getAllDepts() {
    const data = await this.departmentModel.find().sort({ name: -1 });

    return {
      message: 'Departments fetched',
      success: true,
      data,
    };
  }

  private async seedColleges() {
    const colleges = await this.collegeModel.countDocuments();

    if (colleges === 0) {
      for (const college_data of COLLEGES_AND_DEPARTMENTS) {
        const college = await this.collegeModel.create({
          name: college_data.name,
          acronym: college_data.acronym,
        });

        for (const dept of college_data.departments) {
          await this.departmentModel.create({
            college: college._id,
            name: dept.name,
            acronym: dept.acronym,
            level_count: college_data.level,
          });
        }
      }

      this._logger.log('COLLEGES AND DEPARTMENTS SEEDED ✅');
    }
  }
}
