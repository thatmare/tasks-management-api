import { IsString, IsDate, IsBoolean, IsOptional, IsNotEmpty } from "class-validator"

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsOptional()
    asignee?: string

    @IsString()
    @IsOptional()
    category?: string

    @IsDate()
    @IsOptional()
    dueDate?: Date

    @IsBoolean()
    @IsOptional()
    isDeleted: boolean
}
