import { IsEmail, IsString } from 'class-validator';
import type { LoginCredentials } from '@taskly/types';

export class LoginDto implements LoginCredentials {
  @IsEmail({}, { message: 'Email invalide' })
  email: LoginCredentials['email'];

  @IsString()
  password: LoginCredentials['password'];
}
