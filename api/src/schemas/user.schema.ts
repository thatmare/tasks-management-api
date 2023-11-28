import { Schema, Prop } from "@nestjs/mongoose"

@Schema({

})

export class User {
    @Prop({
        unique: true,
    })
    id: number

    @Prop({
        required: true
    })
    name: string

    @Prop({
        required: true,
        unique: true,
        trim: true
    })
    email: string

    @Prop({
        required: true
    })
    password: string
}