import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Category, CategorySchema } from './schemas/category.schema'
import { TicketsModule } from '../tickets/tickets.module'
import { TicketSchema, Ticket } from '../tickets/schemas/ticket.schema'

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    TicketsModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
