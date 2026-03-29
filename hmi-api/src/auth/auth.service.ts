import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto, LoginRequestDto, OtpSendRequestDto, OtpVerifyRequestDto } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterRequestDto) {
    const existing = await this.prisma.utilisateur.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException({
        statut: 409,
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Un compte avec cet email existe déjà',
      });
    }

    // In a real app we encode password using bcrypt...
    const preHashedPwd = data.mot_de_passe + "_hashed"; 

    const user = await this.prisma.utilisateur.create({
      data: {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        mot_de_passe: preHashedPwd,
        role: data.role as Role,
        actif: false, // Inactive until OTP verified
      }
    });

    return {
      message: `Compte créé. Un code OTP a été envoyé au ${user.telephone}`,
      utilisateur_id: user.id
    };
  }

  async login(data: LoginRequestDto) {
    const user = await this.prisma.utilisateur.findUnique({ where: { email: data.email } });
    // In realistic app, check bcrypt validation here.
    if (!user || user.mot_de_passe !== data.mot_de_passe + "_hashed") {
      throw new UnauthorizedException({
        statut: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect'
      });
    }

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expires_in: 900,
      role: user.role,
      utilisateur_id: user.id
    };
  }

  async sendOtp(data: OtpSendRequestDto) {
    // Mocking OTP integration
    return {
      message: `Code OTP envoyé au ${data.telephone}`,
      expire_dans_secondes: 600
    };
  }

  async verifyOtp(data: OtpVerifyRequestDto) {
    if (data.code !== '483021') { // Stub logic according to OpenAPI example
      throw new UnauthorizedException({
        statut: 400,
        code: 'INVALID_OTP',
        message: 'Code OTP invalide ou expiré'
      });
    }
    
    // Auto-login after verification stub
    const payload = { sub: 'mock123', role: 'etablissement' };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expires_in: 900,
      role: 'etablissement',
      utilisateur_id: 'mock123',
      telephone_verifie: true
    };
  }
}
