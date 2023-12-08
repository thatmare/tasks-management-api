import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
import { Factory } from 'nestjs-seeder'

@Schema()
export class User extends Document {
  @Factory(faker => faker.person.firstName())
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string

  @Factory(faker => faker.person.lastName())
  @Prop({
    required: true,
    trim: true,
  })
  lastName: string

  @Factory(faker => faker.internet.email())
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  email: string

  @Factory(faker => faker.internet.password())
  @Prop({
    required: true
  })
  password: string

  @Factory(faker => faker.date.anytime())
  @Prop({
    required: true,
  })
  birthday: Date

  @Factory(faker => faker.person.gender())
  @Prop({
    required: true,
  })
  gender: string

  @Factory(faker => faker.date.recent())
  @Prop()
  lastConnection: Date

  @Factory(faker => faker.date.recent())
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