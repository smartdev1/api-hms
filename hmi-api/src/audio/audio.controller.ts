import { Controller, Post, Get, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioUploadDto, SyncPayloadDto } from './dto/audio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Roles(Role.etablissement, Role.admin)
  @Post('capturer')
  @UseInterceptors(FileInterceptor('audio', {
    limits: { fileSize: 512 * 1024 }, // 512 Kb max
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^audio\/(wav|mp4|mpeg|ogg)$/)) {
        return cb(new BadRequestException({
          statut: 400,
          code: 'INVALID_AUDIO',
          message: 'Format audio non supporté ou taille > 512 Ko'
        }), false);
      }
      cb(null, true);
    }
  }))
  uploadAudio(@UploadedFile() file: Express.Multer.File, @Body() body: AudioUploadDto) {
    if (!file) throw new BadRequestException('Fichier audio manquant');
    return this.audioService.processRealTime(file, body);
  }

  @Roles(Role.etablissement, Role.admin)
  @Post('sync')
  syncOffline(@Body() body: SyncPayloadDto) {
    return this.audioService.processSync(body);
  }

  @Get('captures/:id')
  getCaptureResult(@Param('id') id: string) {
    return this.audioService.getCaptureResult(id);
  }

  @Get('config')
  getConfig() {
    return this.audioService.getConfig();
  }
}
