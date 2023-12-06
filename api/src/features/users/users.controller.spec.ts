import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { mock } from 'jest-mock-extended'
import { RequestWithUser } from './users.controller'

// describe('UsersController', () => {
//   let controller: UsersController

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [UsersService],
//     }).compile()

//     controller = module.get<UsersController>(UsersController)
//   })

//   it('should be defined', () => {
//     expect(controller).toBeDefined()
//   })
// })

// Mock UsersService
const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

// Mock RequestWithUser
const mockRequestWithUser = mock<RequestWithUser>()
mockRequestWithUser.user = { sub: 'test-sub' }

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a user', () => {
    const userDto = {
      firstName: "Marissa",
      lastName: "Vargas",
      email: "canales@example.com",
      password: "123",
      birthday: new Date("1990-01-01T00:00:00.000Z"),
      gender: "female",
    }
    controller.create(userDto)
    expect(mockUsersService.create).toHaveBeenCalledWith(userDto)
  })

  it('should find all users', () => {
    controller.findAll()
    expect(mockUsersService.findAll).toHaveBeenCalled()
  })

  it('should find one user', () => {
    const userId = 'test-id'
    controller.findOne(userId)
    expect(mockUsersService.findOne).toHaveBeenCalledWith(userId)
  })

  it('should update a user', () => {
    const userId = 'test-id'
    const updateUserDto = {
      firstName: "Lorena",
      lastName: "Vargas",
     }
    controller.update(userId, updateUserDto, mockRequestWithUser)
    expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto)
  })

  it('should remove a user', () => {
    const userId = 'test-id'
    controller.remove(userId, mockRequestWithUser)
    expect(mockUsersService.remove).toHaveBeenCalledWith(userId)
  })
})
