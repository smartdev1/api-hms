import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto, LoginRequestDto, OtpSendRequestDto, OtpVerifyRequestDto, RefreshRequestDto, PasswordResetRequestDto, PasswordResetConfirmDto } from './dto/auth.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginRequestDto) {
    return this.authService.login(body);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('otp/envoyer')
  sendOtp(@Body() body: OtpSendRequestDto) {
    return this.authService.sendOtp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('otp/verifier')
  verifyOtp(@Body() body: OtpVerifyRequestDto) {
    return this.authService.verifyOtp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() body: RefreshRequestDto) {
    // Stub definition
    return { access_token: "new_token", refresh_token: "new_refresh_token" };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    return { message: "Déconnexion réussie" };
  }

  @HttpCode(HttpStatus.OK)
  @Post('mot-de-passe/reinitialiser')
  resetPasswordRequest(@Body() body: PasswordResetRequestDto) {
    return { message: "Si ce compte existe, un email de réinitialisation a été envoyé" };
  }

  @HttpCode(HttpStatus.OK)
  @Post('mot-de-passe/confirmer')
  resetPasswordConfirm(@Body() body: PasswordResetConfirmDto) {
    return { message: "Opération effectuée avec succès" };
  }
}
