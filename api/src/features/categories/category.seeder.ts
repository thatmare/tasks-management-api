import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Category } from "./schemas/category.schema"
import { Seeder, DataFactory } from "nestjs-seeder"

@Injectable()
export class CategorySeeder implements Seeder {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

    async seed(): Promise<any> {

    const count = await this.categoryModel.countDocuments().exec()

    if(count > 0) {
        return
    }

    const categories = DataFactory.createForClass(Category).generate(5)

    return this.categoryModel.insertMany(categories)
    }

    async drop(): Promise<any> {
        return this.categoryModel.deleteMany({})
    }
}