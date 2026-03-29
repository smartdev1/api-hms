import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { UpdateUtilisateurDto } from './dto/utilisateurs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Roles(Role.admin)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limite') limite: string = '20',
    @Query('role') role?: Role,
    @Query('actif') actif?: string,
    @Query('q') q?: string,
  ) {
    return this.utilisateursService.findAll(Number(page), Number(limite), role, actif, q);
  }

  @Get('moi')
  getProfile(@CurrentUser() user: any) {
    return this.utilisateursService.findOne(user.utilisateur_id);
  }

  @Patch('moi')
  updateProfile(@CurrentUser() user: any, @Body() body: UpdateUtilisateurDto) {
    return this.utilisateursService.update(user.utilisateur_id, body);
  }

  @Roles(Role.admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateursService.findOne(id);
  }

  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateursService.remove(id);
  }
}
