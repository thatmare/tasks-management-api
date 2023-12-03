import { IsString, IsDate, IsBoolean, IsOptional} from "class-validator"

export class CreateTicketDto {
    @IsString()
    title: string

    @IsString()
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
