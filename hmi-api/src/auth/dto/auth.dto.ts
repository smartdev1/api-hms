import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @MinLength(8)
  mot_de_passe: string;

  @IsEnum(Role)
  role: Role;
}

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  mot_de_passe: string;
}

export class OtpSendRequestDto {
  @IsString()
  @IsNotEmpty()
  telephone: string;
}

export class OtpVerifyRequestDto {
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class RefreshRequestDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export class PasswordResetRequestDto {
  @IsEmail()
  email: string;
}

export class PasswordResetConfirmDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8)
  nouveau_mot_de_passe: string;
}
