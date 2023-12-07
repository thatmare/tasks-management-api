import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

describe('UsersService', () => {
  let service: UsersService
  let mockUserModel: any

  beforeEach(async () => {
    mockUserModel = {
      create: jest.fn().mockResolvedValue({ _id: 'someObjectId' }),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ _id: 'someObjectId' }),
      findById: jest.fn().mockResolvedValue({ _id: 'someObjectId' }),
      updateOne: jest.fn().mockResolvedValue({ ok: 1 }),
      findOneAndUpdate: jest.fn().mockResolvedValue({ _id: 'someObjectId' }),
      findByIdAndDelete: jest.fn().mockResolvedValue({ _id: 'someObjectId' }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserModel',
          useValue: mockUserModel,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: "Marissa",
      lastName: "Vargas",
      email: "canales@example.com",
      password: "123",
      birthday: new Date("1990-01-01T00:00:00.000Z"),
      gender: "female",
    }
    const result = await service.create(createUserDto)
    expect(result).toEqual({ _id: 'someObjectId' })
    expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto)
  })

  it('should find all users', async () => {
    const result = await service.findAll()
    expect(result).toEqual([])
    expect(mockUserModel.find).toHaveBeenCalled()
  })

  it('should find user by email', async () => {
    const result = await service.findByEmail('test@example.com')
    expect(result).toEqual({ _id: 'someObjectId' })
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
  })

  it('should find one user by id', async () => {
    const result = await service.findOne('someObjectId')
    expect(result).toEqual({ _id: 'someObjectId' })
    expect(mockUserModel.findById).toHaveBeenCalledWith('someObjectId')
  })

  it('should update user last connection', async () => {
    const result = await service.userLoggedIn('someObjectId')
    expect(result).toEqual({ ok: 1 })
    expect(mockUserModel.updateOne).toHaveBeenCalledWith({ _id: 'someObjectId' }, { lastConnection: expect.any(Date) })
  })

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: "Marissa"
    }
    const result = await service.update('someObjectId', updateUserDto)
    expect(result).toEqual({ _id: 'someObjectId' })
    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'someObjectId' }, updateUserDto)
  })

  it('should remove a user', async () => {
    const result = await service.remove('someObjectId')
    expect(result).toEqual({ _id: 'someObjectId' })
    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('someObjectId')
  })
})