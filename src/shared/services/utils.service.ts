import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import { ResolvePaginationQuery } from '../interfaces/pagination.interface';

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

  resolvePaginationQuery(query: ResolvePaginationQuery) {
    const page = Number(query.page) || 1;
    let limit = query?.limit ?? 100000000000;
    const skip = (page - 1) * limit;
    console.log(query.count, limit);
    const totalPages = Math.ceil(query.count / limit);

    if (query?.limit === 0) limit = query.count;

    if (query?.limit === 0 && query.count === 0) limit++;

    return {
      skip,
      page,
      limit,
      totalPages,
      count: query.count,
    };
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
}
