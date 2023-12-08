import { ApiProperty } from "@nestjs/swagger"

export class TicketResponse {
    @ApiProperty({ example: '60f1b2b9d4b4f3b5e4f7b9a1' })
    _id: string

    @ApiProperty({ example: 'Ticket title' })
    title: string
  
    @ApiProperty({ example: 'Ticket description' })
    description: string
  
    @ApiProperty({ example: '60f1b2b9d4b4f3b5e4f7b9a1' })
    category: string
  
    @ApiProperty({ example: '60f1b2b9d4b4f3b5e4f7b9a1' })
    asignee: string
  
    @ApiProperty({ example: '2021-07-16T16:29:21.000Z' })
    createdAt: Date
  
    @ApiProperty({ example: '2021-07-16T16:29:21.000Z' })
    updatedAt: Date
}