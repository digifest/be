import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Auth } from './schemas/auth.schema';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto';
import { UtilService } from 'src/shared/services/utils.service';
import { JwtService } from '@nestjs/jwt';
import { add, isAfter } from 'date-fns';
import { Token } from './schemas/token.schema';
import { TokenType } from './enums';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from 'src/shared/events/enums';
import { SendMail } from 'src/shared/mail/interfaces';
import { RoleNames } from '../user/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>,

    private readonly utilService: UtilService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async upsertToken(
    filter: FilterQuery<Token>,
    update: UpdateQuery<Token>,
  ) {
    return await this.tokenModel.updateOne(
      filter,
      { ...filter, ...update },
      { upsert: true },
    );
  }

  private async signJwtToken(userId: string) {
    const access_token = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '7d' },
    );

    await this.authModel.updateOne(
      { user: userId },
      {
        access_token,
        access_token_expires: add(new Date(), { days: 7 }),
      },
    );

    return access_token;
  }

  async signUp(body: SignUpDto) {
    const { firstName, lastName, department, college, password } = body;

    const phoneNumber = this.utilService.formatCountryPhoneNumber(
      body.phoneNumber,
    );
    const email = body.email.toLowerCase();

    const userExists = await this.userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (userExists) throw new BadRequestException('Oops! user already exists');

    const hashedPassword = await this.utilService.hashPassword(password);

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      college,
      role: RoleNames.User,
    });

    await this.authModel.create({
      user: user._id,
      password: hashedPassword,
      password_history: [hashedPassword],
    });

    const access_token = await this.signJwtToken(user._id);

    return access_token;
  }

  async signIn(body: SignInDto) {
    const { password, credential, role } = body;

    const user = await this.userModel.findOne({
      $or: [
        {
          email: credential,
        },
        {
          phoneNumber: this.utilService.formatCountryPhoneNumber(credential),
        },
      ],
      role,
    });

    if (!user) throw new NotFoundException('Invalid credentials');

    const userAuth = await this.authModel.findOne({ user: user._id });

    if (!userAuth) throw new NotFoundException('Invalid credentials');

    const isPasswordMatch = await this.utilService.comparePassword(
      password,
      userAuth.password,
    );

    if (!isPasswordMatch) throw new BadRequestException('Invalid credentials');

    const access_token = await this.signJwtToken(user._id);

    return access_token;
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const { credential } = body;

    const user = await this.userModel.findOne({
      $or: [
        {
          email: credential.toLowerCase(),
        },
        {
          phoneNumber: this.utilService.formatCountryPhoneNumber(credential),
        },
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    const token = this.utilService.generateToken();

    await this.upsertToken(
      {
        key: user?.email,
        token_type: TokenType.password_reset,
      },
      {
        value: token,
        expires_at: add(new Date(), { minutes: 15 }),
        user: user?._id,
      },
    );

    const link = `${this.configService.get<string>('FRONTED_URL')}/reset-password?token=${token}&credential=${user?.email}&credential_type=email`;

    const emailDto: SendMail = {
      to: user?.email,
      subject: 'Forgot Password',
      template: 'forgot-password.ejs',
      context: {
        name: user?.firstName,
        link,
      },
    };

    this.eventEmitter.emit(EventNames.EMAIL, emailDto);

    return {
      success: true,
      message: 'Password reset otp sent',
    };
  }

  async resetPassword(body: ResetPasswordDto) {
    const { password, token, credential } = body;

    const dbToken = await this.tokenModel.findOne({
      key: credential,
      value: token,
      token_type: TokenType.password_reset,
    });

    if (!dbToken) throw new NotFoundException('invalid or expired token');
    if (dbToken.value != token)
      throw new NotFoundException('invalid or expired token');
    if (isAfter(new Date(), dbToken.expires_at))
      throw new NotFoundException('invalid or expired token');

    const auth = await this.authModel.findOne({ user: dbToken.user });
    if (!auth) throw new NotFoundException('user not found');

    for (const old_password of auth.password_history) {
      if (await this.utilService.comparePassword(password, old_password)) {
        throw new BadRequestException(
          "Oops! you can not use a password you've used in the past",
        );
      }
    }

    const hashedPassword = await this.utilService.hashPassword(password);
    auth.password = hashedPassword;
    auth.password_history.push(hashedPassword);
    await auth.save();

    await dbToken.deleteOne();

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
