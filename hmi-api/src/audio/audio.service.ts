import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AudioUploadDto, SyncPayloadDto } from './dto/audio.dto';

@Injectable()
export class AudioService {
  constructor(private prisma: PrismaService) {}

  async processRealTime(file: Express.Multer.File, data: AudioUploadDto) {
    const capture = await this.prisma.capture.create({
      data: {
        timestamp_capture: new Date(data.timestamp_capture),
        duree_diffusion_secondes: data.duree_secondes,
        etablissement_id: data.etablissement_id,
        statut: 'recu',
        message: 'Extrait audio reçu, reconnaissance en cours',
      }
    });

    return {
      capture_id: capture.id,
      statut: 'recu',
      message: 'Extrait audio reçu, reconnaissance en cours',
      timestamp_reception: new Date().toISOString()
    };
  }

  async processSync(data: SyncPayloadDto) {
    // Implement parsing 50 base64 captures max here
    const results: any[] = [];
    for (const cap of data.captures) {
      results.push({
        reference_locale: cap.reference_locale,
        capture_id: `offline-${Date.now()}`,
        statut: 'accepte',
        motif_rejet: null
      });
    }

    return {
      total_recu: data.captures.length,
      total_accepte: data.captures.length,
      total_rejete: 0,
      captures: results
    };
  }

  async getCaptureResult(id: string) {
    const capture = await this.prisma.capture.findUnique({
      where: { id },
      include: { musique: true }
    });
    if (!capture) {
      throw new NotFoundException({ statut: 404, code: 'NOT_FOUND', message: 'Capture introuvable' });
    }
    return capture;
  }

  getConfig() {
    return {
      intervalle_capture_secondes: 60,
      duree_capture_secondes: 45,
      seuil_confiance_minimum: 0.60,
      max_captures_offline: 200,
      format_audio_prefere: 'wav',
      frequence_echantillonnage_hz: 44100
    };
  }
}
