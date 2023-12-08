import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Ticket } from "./schemas/ticket.schema"
import { Seeder, DataFactory } from "nestjs-seeder"
import { User } from "../users/schemas/user.schema"

@Injectable()
export class TicketSeeder implements Seeder {
    constructor(
        @InjectModel(Ticket.name) 
        private readonly ticketModel: Model<Ticket>,
        @InjectModel(User.name)
        private readonly userModel: Model<User>
        ) {}

    async seed(): Promise<any> {

    const count = await this.ticketModel.countDocuments().exec()

    if(count > 0) {
        return
    }

    const tickets = DataFactory.createForClass(Ticket).generate(25)

    const user = await this.userModel.aggregate([{ $sample: { size: 1 } }])

    tickets.forEach(ticket => {
        ticket.asignee = user[0]._id
    })

    return this.ticketModel.insertMany(tickets)
    }

    async drop(): Promise<any> {
        return this.ticketModel.deleteMany({})
    }
}