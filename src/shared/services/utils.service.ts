import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import { PaginationQuery } from '../interfaces/pagination.interface';
import { isNumber } from 'lodash';

@Injectable()
export class UtilService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string) {
    const hashedPassword = await argon.hash(password);

    return hashedPassword;
  }

  async comparePassword(password: string, hash: string) {
    return await argon.verify(hash, password);
  }

  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  setHourAndMin(hour: number, min: number) {
    const today = new Date();
    today.setUTCHours(hour);
    today.setUTCMinutes(min);
    return today;
  }

  formatCountryPhoneNumber(phoneNumber: string, countryCode = '234') {
    if (!phoneNumber) return null;
    if (phoneNumber.startsWith('+')) {
      return phoneNumber.substring(1);
    }
    if (phoneNumber.startsWith('0')) {
      return countryCode + phoneNumber.substring(1);
    }
    if (phoneNumber.startsWith(countryCode)) {
      return phoneNumber;
    }
    return `${countryCode}${phoneNumber}`;
  }

  getPaginationData(query: PaginationQuery, count: number) {
    const skip = isNumber(query?.page) ? query.page : 1;
    let limit = query?.limit ?? 30;
    const offset = (skip - 1) * limit;
    const totalPages = Math.ceil(count / limit);

    if (query?.limit === 0 && count === 0) limit++;

    return {
      limit,
      offset,
      totalPages,
      page: skip,
    };
  }
}
