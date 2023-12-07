import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { CategoriesService } from './categories.service'
import { Category } from './schemas/category.schema'
import { Ticket } from '../tickets/schemas/ticket.schema'
import { Model } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'

describe('CategoriesService', () => {
  let service: CategoriesService
  let categoryModel: Model<Category>
  let ticketModel: Model<Ticket>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            new: true,
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([]),
            }),
            findOne: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            findByIdAndUpdate: jest.fn().mockResolvedValue({}),
            findByIdAndDelete: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getModelToken(Ticket.name),
          useValue: {
            exists: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name))
    ticketModel = module.get<Model<Ticket>>(getModelToken(Ticket.name))
  })

  it('should create a category', async () => {
    const createCategoryDto: CreateCategoryDto = { category: 'Test', description: 'Test' }
    await service.create(createCategoryDto)
    expect(categoryModel.create).toHaveBeenCalledWith(createCategoryDto)
  })

  it('should fetch all categories with correct sorting', async () => {
    const sortOptions: Record<string, 'asc' | 'desc'> = { category: 'asc' }
    await service.findAll('asc')
    expect(categoryModel.find).toHaveBeenCalled()
    expect(categoryModel.find().sort).toHaveBeenCalledWith(sortOptions)
  })

  it('should find category by name', async () => {
    const category = 'Test'
    await service.findByCategory(category)
    expect(categoryModel.find).toHaveBeenCalledWith({ category: category })
  })

  it('should find category by id', async () => {
    const id = '123'
    await service.findOne(id)
    expect(categoryModel.findOne).toHaveBeenCalledWith({ _id: id })
  })

  it('should update category by id', async () => {
    const id = '123'
    const updateCategoryDto = { category: 'Updated' }
    await service.update(id, updateCategoryDto)
    expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateCategoryDto, { new: true })
  })

  it('should remove category by id', async () => {
    const id = '123';
    (ticketModel.exists as jest.Mock).mockImplementation(() => Promise.resolve(false))
    await service.remove(id)
    expect(ticketModel.exists).toHaveBeenCalledWith({ category: id })
    expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(id)
  })

  it('should not remove category if it is referenced by a ticket', async () => {
    const id = '123';
    (ticketModel.exists as jest.Mock).mockImplementation(() => Promise.resolve(true))
    await expect(service.remove(id)).rejects.toThrow('There is a ticket referencing this category')
    expect(ticketModel.exists).toHaveBeenCalledWith({ category: id })
    expect(categoryModel.findByIdAndDelete).not.toHaveBeenCalled()
  })
})