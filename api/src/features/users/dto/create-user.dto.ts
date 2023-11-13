import { IsString, IsEmail, IsISO8601 } from "class-validator" 

export class CreateUserDto {
    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsEmail()
    email: string
    
    @IsString()
    password: string

    @IsISO8601()    
    birthday: Date

    @IsString()
    gender: string

    @IsISO8601()
    lastConnection: Date

    @IsISO8601()
    lastUpdate: Date
}