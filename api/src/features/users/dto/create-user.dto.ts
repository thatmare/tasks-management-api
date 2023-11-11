import { IsString, IsEmail, IsDate } from "class-validator" 

export class CreateUserDto {
    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsEmail()
    email: string
    
    @IsString()
    password: string

    @IsDate()
    birthday: Date

    @IsString()
    gender: string

    @IsDate()
    lastConnection: Date

    @IsDate()
    lastUpdate: Date
}