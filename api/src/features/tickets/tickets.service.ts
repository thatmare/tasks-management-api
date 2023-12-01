import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketDocument, Ticket } from './schemas/ticket.schema'
import { Model } from 'mongoose'
import { DeletedTicket } from './schemas/deleted-ticket.schema'

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket>,
    @InjectModel(DeletedTicket.name)
    private deletedTicketModel: Model<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const newTicket = this.ticketModel.create(createTicketDto)
    return newTicket
  }

  async findAll() {
    return this.ticketModel.find({ isDeleted: false })
  }

  async findOne(id: string) {
    return this.ticketModel.findOne({ _id: id, isDeleted: false })
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.ticketModel.findByIdAndUpdate(id, updateTicketDto, {
      new: true,
    })
  }

  async softDelete(id: string) {
    const deletedTicket = await this.ticketModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )
  
    if (deletedTicket) {
      const deletedTicketDoc = new this.deletedTicketModel(deletedTicket.toObject())
      await deletedTicketDoc.save()
  
      // Eliminar el documento de la colección principal después de guardarlo en la colección de eliminados
      await this.ticketModel.deleteOne({ _id: id })
    }
  
    return deletedTicket
  }
  
}

// manejo de errores
// auth