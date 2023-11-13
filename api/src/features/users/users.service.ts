import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './schemas/user.schema'
import { Model } from 'mongoose'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userModel.create(createUserDto)
    const createdUser = (await newUser).save()
    return createdUser
  }

  // findAll() {
  //   return this.userModel.find()
  // }

  // findOne(id: string) {
  //   return this.userModel.findById(id)
  // }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto)
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id)
  }
}
