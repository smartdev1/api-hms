import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { EtablissementsModule } from './etablissements/etablissements.module';
import { AudioModule } from './audio/audio.module';
import { DiffusionsModule } from './diffusions/diffusions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportingModule } from './reporting/reporting.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    UtilisateursModule,
    EtablissementsModule,
    AudioModule,
    DiffusionsModule,
    DashboardModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
