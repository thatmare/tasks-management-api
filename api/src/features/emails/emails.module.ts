import { Module } from '@nestjs/common'
import { EmailsService } from './emails.service'
// import { EmailsController } from './emails.controller'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: '<host>',
        port: Number('<port>'),
        secure: false,
        auth: {
          user: '<username>',
          password: '<password>',
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
    })
  ],
  providers: [EmailsService],
})
export class EmailsModule {}
