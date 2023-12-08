import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "./schemas/user.schema"
import { Seeder, DataFactory } from "nestjs-seeder"

@Injectable()
export class UserSeeder implements Seeder {
    constructor(
        @InjectModel(User.name) 
        private readonly userModel: Model<User>
        ) {}

    async seed(): Promise<any> {

    const count = await this.userModel.countDocuments().exec()

    if(count > 0) {
        return
    }

    const users = DataFactory.createForClass(User).generate(3)

    return this.userModel.insertMany(users)
    }

    async drop(): Promise<any> {
        return this.userModel.deleteMany({})
    }
}