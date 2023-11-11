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
    return newUser.save()
  
    //'This action adds a new user'
  }

  findAll() {
    return this.userModel.find()
    //`This action returns all users`;
  }

  findOne(id: number) {
    return this.userModel.findById(id)
    //`This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto)
    //`This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userModel.findByIdAndDelete(id)
    //`This action removes a #${id} user`;
  }
}
