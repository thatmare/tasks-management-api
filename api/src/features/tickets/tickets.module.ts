import { Module } from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Ticket, TicketSchema } from './schemas/ticket.schema'
import { DeletedTicket, DeletedTicketSchema } from './schemas/deleted-ticket.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: DeletedTicket.name, schema: DeletedTicketSchema}])
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
