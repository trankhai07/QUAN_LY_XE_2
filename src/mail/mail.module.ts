import { Module } from '@nestjs/common';

import { MailController } from './mail.controller';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `No Reply<${config.get('MAIL_FROM')}`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },

        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [],
  controllers: [MailController]
})
export class MailModule { }
