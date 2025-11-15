import { IsEmail, IsString, IsOptional, MinLength, Matches } from 'class-validator';
import type { RegisterCredentials } from '@taskly/types';

export class RegisterDto implements RegisterCredentials {
  @IsEmail({}, { message: 'Email invalide' })
  email: RegisterCredentials['email'];

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
  })
  password: RegisterCredentials['password'];

  @IsString()
  @IsOptional()
  name?: RegisterCredentials['name'];
}
