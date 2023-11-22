import { Injectable } from '@nestjs/common'
// import { CreateEmailDto } from './dto/create-email.dto';
// import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer/dist'

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService
    ) {}

  async resetPasswordEmail(data) {
    const { email } = data

    const subject = `Reset passowrd: ${email}`

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: '', // pending to add template?
      context: {
        // pending to add context?
      }
    })
  }
  
  // create(createEmailDto: CreateEmailDto) {
  //   return 'This action adds a new email';
  // }

  // findAll() {
  //   return `This action returns all emails`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} email`;
  // }

  // update(id: number, updateEmailDto: UpdateEmailDto) {
  //   return `This action updates a #${id} email`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} email`;
  // }
}
