import { AllConfigType } from './config/config.type';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  }); // mở cấu hình cors
  const configService = app.get(ConfigService<AllConfigType>); // custom lại configService

  app.useGlobalPipes(new ValidationPipe()); // validate body

  app.setGlobalPrefix(  // set đường dẫn đầu
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({    // đưa version vào đường dẫn
    type: VersioningType.URI,
  });



  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('List APIs for simple Booking')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get('app.port', { infer: true }) || 3002);
}
bootstrap();
