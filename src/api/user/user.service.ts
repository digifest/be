import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RoleNames } from './enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getUser(userId: string) {
    const data = await this.userModel
      .findById(userId)
      .populate('department', '-college -createdAt -updatedAt')
      .populate('college', '-createdAt -updatedAt');

    if (!data) throw new NotFoundException('Oops! user not found');

    return {
      success: true,
      message: 'User fetched successfully',
      data,
    };
  }
}
