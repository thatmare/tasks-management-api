import { IsString, IsEmail, IsISO8601, MinLength, Matches } from "class-validator"
import { Exclude } from "class-transformer"

export class CreateUserDto {
    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsEmail()
    email: string
    
    @IsString()
    @Exclude({ toPlainOnly: true  })
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password is too weak. It must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.',
    })
    password: string

    @IsISO8601()
    birthday: Date

    @IsString()
    gender: string
}