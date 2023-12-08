import { ApiProperty } from "@nestjs/swagger"

export class CategoryResponse {
  @ApiProperty({ example: '60f1b2b9d4b4f3b5e4f7b9a1' })
  _id: string

  @ApiProperty({ example: 'Category 1' })
  category: string

  @ApiProperty({ example: 'This is a category' })
  description?: string
}