import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { getModelToken } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Category } from '../categories/schemas/category.schema'
import { Ticket } from '../tickets/schemas/ticket.schema'
import * as mongoose from 'mongoose'

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: CategoriesService

  const updateCategoryDto = {
    category: 'Updated Category',
    description: 'Updated Description',
  }

  const mockCategory = {
    _id: new mongoose.Types.ObjectId(),
    category: 'Test Category',
    description: 'Test Description'
  } as unknown as Category & Document

  
  const updatedCategory = {
    ...mockCategory,
    ...updateCategoryDto,
  }


  const mockCategoryModel = {
    create: jest.fn().mockResolvedValue(mockCategory),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([mockCategory])
    }),
    findOne: jest.fn().mockResolvedValue(mockCategory),
    findByIdAndUpdate: jest.fn().mockResolvedValue(updatedCategory),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockCategory),
  }

  const mockTicketModel = {
    // create: jest.fn().mockResolvedValue({}),
    // find: jest.fn().mockResolvedValue([]),
    exists: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
        {
          provide: getModelToken(Ticket.name),
          useValue: mockTicketModel,
        }
      ],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    service = module.get<CategoriesService>(CategoriesService)
  })

  it('should create a category', async () => {
    expect(await controller.create({ category: 'Test Category', description: 'Test Description' })).toBe(mockCategory)
  })

  it('should find all categories', async () => {
    expect(await controller.findAll('asc')).toEqual([mockCategory])
  })

  it('should find one category', async () => {
    expect(await controller.findOne('1')).toBe(mockCategory)
  })

  it('should update a category', async () => {


    mockCategoryModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCategory)

    expect(await controller.update(mockCategory._id.toString(), updateCategoryDto)).toEqual(updatedCategory)
    expect(mockCategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCategory._id.toString(),
      updateCategoryDto,
      { new: true },
    )
  })

  it('should remove a category', async () => {
    mockCategoryModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockCategory)

    await controller.remove(mockCategory._id.toString())

    expect(mockCategoryModel.findByIdAndDelete).toHaveBeenCalledWith(mockCategory._id.toString())
  })
  // add other tests...
})
  // it('should update a category', async () => {
  //   const result = { id: '1', name: 'Updated Category' }
  //   jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(result))

  //   expect(await controller.update('1', { name: 'Updated Category' })).toBe(result)
  // })

  // it('should remove a category', async () => {
  //   const result = { id: '1', name: 'Test Category', deleted: true }
  //   jest.spyOn(service, 'remove').mockImplementation(() => Promise.resolve(result))

  //   expect(await controller.remove('1')).toBe(result)
  // })