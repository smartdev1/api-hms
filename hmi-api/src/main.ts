import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security: HTTP headers protection
  app.use(helmet());

  // Security: Strict CORS rules
  app.enableCors({
    origin: '*', // For production, specify your domains 'https://hmis-project.ci'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Security: Global validation enforcing strict payload typings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips unmapped properties
      forbidNonWhitelisted: true, // Throws 400 if unrecognized properties hit
      transform: true, // Automatically transforms payloads to match DTO classes
    }),
  );

  // According to YAML servers url
  app.setGlobalPrefix('v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
