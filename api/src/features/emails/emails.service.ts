import { Injectable } from '@nestjs/common'
// import { CreateEmailDto } from './dto/create-email.dto';
// import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer/dist'
import { OnEvent } from '@nestjs/event-emitter'
import { EventPayloads } from './interface/event-types.interface'

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService
    ) {}

  @OnEvent('auth.reset-password')
  async resetPasswordEmail(data: EventPayloads['auth.reset-password']) {
    const { email, name } = data

    const subject = `Reset passowrd: ${name}`

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './reset-password',
      context: {
        name
      }
    })
  }
}
