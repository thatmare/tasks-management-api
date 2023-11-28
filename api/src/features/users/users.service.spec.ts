import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

// Mock del módulo que contiene el servicio de MongoDB
jest.mock('@nestjs/mongoose', () => ({
  getModelToken: jest.fn(() => 'UserModel'),
}))

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserModel', // Esto debe coincidir con lo que devuelve getModelToken
          useValue: {
            create: jest.fn().mockResolvedValue({
              _id: 'someObjectId',
              firstName: "Marissa",
              lastName: "Vargas",
              email: "canales@example.com",
              password: "123",
              birthday: new Date("1990-01-01T00:00:00.000Z"),
              gender: "female",
              lastConnection: new Date("1990-01-01T00:00:00.000Z"),
              lastUpdate: new Date("1990-01-01T00:00:00.000Z"),
              // ... otros campos
            }),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })


  it('should create a new user with the correct input', async () => {
    const userInput: CreateUserDto = {
      firstName: "Marissa",
      lastName: "Vargas",
      email: "canales@example.com",
      password: "123",
      birthday: new Date("1990-01-01T00:00:00.000Z"),
      gender: "female",
      lastConnection: new Date("1990-01-01T00:00:00.000Z"),
      lastUpdate: new Date("1990-01-01T00:00:00.000Z"),
    }

    const result = await service.create(userInput)

    console.log(result, "aqui result")
    expect(result).toEqual({ _id: 'someObjectId', ...userInput })
  })
})


