import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, HydratedDocument } from "mongoose"
import { Type } from "class-transformer"
import { Category } from "@app/features/categories/schemas/category.schema"
import * as mongoose from 'mongoose'

@Schema({
    timestamps: true
})
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
        default: ''
    })
    asignee?: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: Category.name
    })
    @Type(() => Category)
    category?: string

    @Prop({
        default: () => new Date().toISOString()
    })
    dueDate?: Date

    @Prop({
        default: false,
    })
    isDeleted: boolean
}

export const TicketSchema = SchemaFactory.createForClass(Ticket)

export type TicketDocument = HydratedDocument<Ticket>