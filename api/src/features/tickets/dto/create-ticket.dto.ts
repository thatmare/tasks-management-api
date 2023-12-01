import { IsString, IsISO8601, IsBoolean } from "class-validator"

export class CreateTicketDto {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    asignee: string

    @IsString()
    category: string

    @IsISO8601()
    dueDate: Date

    @IsBoolean()
    isDeleted: boolean

    @IsISO8601()
    deletedAt: Date
}
