import { RoleNames } from 'src/api/user/enums';
import { IsEnum, IsString } from 'src/shared/decorators';

export class SignUpDto {
  @IsString(false)
  firstName: string;

  @IsString(false)
  lastName: string;

  @IsString(false)
  email: string;

  @IsString(false)
  phoneNumber: string;

  @IsString(false)
  password: string;

  @IsString(false)
  college: string;

  @IsString(false)
  department: string;
}

export class SignInDto {
  @IsString(false)
  credential: string;

  @IsString(false)
  password: string;

  @IsEnum(RoleNames, false)
  role: RoleNames;
}

export class ForgotPasswordDto {
  @IsString(false)
  credential: string;
}

export class ResetPasswordDto {
  @IsString(false)
  credential: string;

  @IsString(false)
  token: string;

  @IsString(false)
  password: string;
}
