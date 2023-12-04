import { Schema, SchemaFactory } from "@nestjs/mongoose"
import { Ticket } from "./ticket.schema"

@Schema()
export class DeletedTicket extends Ticket {}

export const DeletedTicketSchema = SchemaFactory.createForClass(DeletedTicket)