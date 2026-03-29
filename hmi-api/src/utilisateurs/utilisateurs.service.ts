import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUtilisateurDto } from './dto/utilisateurs.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UtilisateursService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limite: number, role?: Role, actifStr?: string, q?: string) {
    const skip = (page - 1) * limite;
    const filter: any = {};
    if (role) filter.role = role;
    if (actifStr) filter.actif = actifStr === 'true';
    if (q) {
      filter.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.utilisateur.findMany({ where: filter, skip, take: limite }),
      this.prisma.utilisateur.count({ where: filter })
    ]);
    return {
      data,
      pagination: { page, limite, total, total_pages: Math.ceil(total / limite) }
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.utilisateur.findUnique({ where: { id } });
    if (!user) {
        throw new NotFoundException({ statut: 404, code: 'NOT_FOUND', message: 'Ressource introuvable' });
    }
    return user;
  }

  async update(id: string, body: UpdateUtilisateurDto) {
    await this.findOne(id); // Assures user exists
    return this.prisma.utilisateur.update({
      where: { id },
      data: body
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.utilisateur.update({
      where: { id },
      data: { actif: false }
    });
    return { message: 'Compte utilisateur désactivé' };
  }
}
