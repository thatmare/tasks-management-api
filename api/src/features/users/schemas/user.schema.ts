import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string

  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  email: string

  @Prop({
    required: true,
  })
  password: string

  @Prop({
    required: true,
  })
  birthday: Date

  @Prop({
    required: true,
  })
  gender: string

  @Prop({ default: Date.now })
  lastConnection: Date

  @Prop({ default: Date.now })
  lastUpdate: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
