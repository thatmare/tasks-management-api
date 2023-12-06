import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { Ticket } from './schemas/ticket.schema'
import { Model } from 'mongoose'
import { DeletedTicket } from './schemas/deleted-ticket.schema'

import { UsersService } from '../users/users.service'

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket>,
    @InjectModel(DeletedTicket.name)
    private deletedTicketModel: Model<Ticket>,
    private userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto, email: string) {
    const data = await this.userService.findByEmail(email)

    if(!createTicketDto.asignee) {
      createTicketDto.asignee = data._id
    }

    const newTicket = await this.ticketModel.create(createTicketDto)
    await newTicket.populate('asignee')
    await newTicket.populate('category')

    return newTicket
  }

  async findAll({ page = 1, limit = 10 }) {
    const docsToSkip = (page - 1) * limit
  
    const findQuery = this.ticketModel
      .find({ isDeleted: false })
      .sort({ _id: 1 })
      .skip(docsToSkip)
      .limit(limit)
  
    const results = await findQuery
    const count = await this.ticketModel.count()
  
    return { results, count }
  }
  
  async findByUser(email: string) {
    const data = await this.userService.findByEmail(email)
    const thisUser = `${data.firstName} ${data.lastName}`

    return this.ticketModel.find({ isDeleted: false, asignee: thisUser}).sort({ dueDate: -1 })
  }

  async findOne(id: string) {
    return this.ticketModel.findOne({ _id: id, isDeleted: false })
  }

  async filterByCategory(aguacate: string) {
    return this.ticketModel.aggregate([ { $match: { category: aguacate } }])
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.ticketModel.findByIdAndUpdate(id, updateTicketDto, {
      new: true,
    }).populate('category')
  }

  async softDelete(id: string) {
    const deletedTicket = await this.ticketModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    )
  
    if (deletedTicket) {
      const deletedTicketDoc = new this.deletedTicketModel(
        deletedTicket.toObject()
        )
      await deletedTicketDoc.save()

      await this.ticketModel.deleteOne({ _id: id })
    }
  
    return deletedTicket
  }
  
}
