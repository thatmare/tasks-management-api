import { Module } from '@nestjs/common'
import { EmailsService } from './emails.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(config: ConfigService) => ({
        transport: {
          host: config.get<string>('EMAIL_HOST'),
          port: config.get<string>('EMAIL_PORT'),
          auth: {
            user: config.get<string>('EMAIL_ADDRESS'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"From Name" <from@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [EmailsService],
})
export class EmailsModule {}
