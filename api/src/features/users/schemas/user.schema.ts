import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class User extends Document {
    @Prop()
    firstName: string

    @Prop()
    lastName: string

    @Prop()
    email: string

    @Prop()
    password: string

    @Prop()
    birthday: Date

    @Prop()
    gender: string

    @Prop({ default: Date.now })
    lastConnection: Date

    @Prop({ default: Date.now })
    lastUpdate: Date
}

export const UserSchema = SchemaFactory.createForClass(User)