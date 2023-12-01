import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, HydratedDocument } from "mongoose"

@Schema()
export class Ticket extends Document {
    @Prop({
        required: true,
        trim: true
    })
    title: string

    @Prop({
        required: true
    })
    description: string

    @Prop({
        required: true
    })
    asignee: string

    @Prop()
    category: string

    @Prop()
    dueDate: Date

    @Prop({
        default: false,
    })
    isDeleted: boolean

    @Prop({
        default: null
    })
    deletedAt: Date
}

export const TicketSchema = SchemaFactory.createForClass(Ticket)

export type TicketDocument = HydratedDocument<Ticket>