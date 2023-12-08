import { ApiProperty } from "@nestjs/swagger"

export class UserResponse {
    @ApiProperty({ example: '60f1b2b9d4b4f3b5e4f7b9a1' })
    _id: string
  
    @ApiProperty({ example: 'test@example.com' })
    email: string
  
    @ApiProperty({ example: 'John' })
    firstName: string
  
    @ApiProperty({ example: 'Doe' })
    lastName: string
  
    @ApiProperty({ example: 'female' })
    gender: Date

    @ApiProperty({ example: '2021-07-16T16:29:21.000Z' })
    birthday: Date

    @ApiProperty({ example: '2021-07-16T16:29:21.000Z' })
    lastConnection: Date
  
    @ApiProperty({ example: '2021-07-16T16:29:21.000Z' })
    lastUpdate: Date
  }
  