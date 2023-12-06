import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { OmitType } from '@nestjs/swagger'
import { IsEmail, IsOptional } from 'class-validator'

export class CreateUserDtoWithoutPassword extends OmitType(CreateUserDto, ['password']) {}

export class UpdateUserDto extends PartialType(CreateUserDtoWithoutPassword) {
    @IsEmail()
    @IsOptional()
    email?: string

    @IsOptional()
    birthday?: Date

    @IsOptional()
    refreshToken?: string
}
