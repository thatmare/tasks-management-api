import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Category } from './schemas/category.schema'
import { Model } from 'mongoose'
import { Ticket } from '../tickets/schemas/ticket.schema'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) 
    private categoryModel: Model<Category>,
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto)
  }

  async findAll(order: 'asc' | 'desc' = 'asc') {
    const sortOptions: Record<string, 'asc' | 'desc'> = { category: order }
  
    return this.categoryModel.find().sort(sortOptions)
  }
  
  async findByCategory(category: string) {
    return this.categoryModel.find({ category: category})
  }

  async findOne(id: string) {
    return this.categoryModel.findOne({ _id: id})
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true
    })
  }

  async remove(id: string) {
    const isCategoryRef = await this.ticketModel.exists({ category: id})

    if(isCategoryRef) {
      throw new Error('There is a ticket referencing this category')
    }

    const deletedCategory = await this.categoryModel.findByIdAndDelete(id)
    return deletedCategory
  }
}
