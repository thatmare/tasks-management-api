import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userModel.create(createUserDto)
    return newUser
  }

  async findAll() {
    return this.userModel.find()
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email })

    return user
  }

  async findOne(id: string) {
    return this.userModel.findById(id)
  }

  async userLoggedIn(id: string) {
    return this.userModel.updateOne({ _id: id }, { lastConnection: new Date() })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto)
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id)
  }
}
