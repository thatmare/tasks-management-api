import { IsString, IsOptional, IsNotEmpty } from "class-validator"

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    category: string

    @IsString()
    @IsOptional()
    description: string
}
