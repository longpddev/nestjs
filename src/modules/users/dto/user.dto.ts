import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { SettingsUser } from './settings.user.dto';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class UserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  // @IsEnum(Gender, {
  //   message: 'gender must be either male or female',
  // })
  // readonly gender: Gender;

  readonly settings: typeof SettingsUser;
}
