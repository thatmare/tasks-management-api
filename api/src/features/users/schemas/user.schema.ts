import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

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

  @Prop()
  lastConnection: Date

  @Prop()
  lastUpdate: Date

  @Prop()
  refreshToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)

export type UserDocument = HydratedDocument<User>

UserSchema.pre('save', function(next) {
  this.lastUpdate = new Date()
  next()
})


UserSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any
  update.lastUpdate = new Date()
  next()
})