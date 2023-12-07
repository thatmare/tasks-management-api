import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import mongoose from 'mongoose'
import { User } from '../users/schemas/user.schema'
import * as argon2 from 'argon2'
import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions'

jest.mock('argon2', () => {
  const mockHash = 'hashedData'
  return {
    verify: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue(mockHash),
  }
})


describe('AuthService', () => {
  let service: AuthService
  let userService: UsersService
  let jwtService: JwtService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            userLoggedIn: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UsersService>(UsersService)

    jwtService = new JwtService()
    configService = new ConfigService()
  })

  it('should sign up a user', async () => {
    const mockUser: Partial<User & Document> = {
      _id: new mongoose.Types.ObjectId(),
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'Password123',
      birthday: new Date(),
      gender: 'male',
    }
  
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)
    jest.spyOn(service, 'hashData').mockResolvedValue('hashedData')
    jest.spyOn(userService, 'create').mockResolvedValue(mockUser as User & Document & { _id: mongoose.Types.ObjectId })
    
    const result = await service.signUp({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'Password123',
      birthday: new Date(),
      gender: 'male',
    })
  
    expect(result).toBeDefined()
  })

  it('should log in a user', async () => {
    const mockUser: Partial<User & Document> = {
      _id: new mongoose.Types.ObjectId(),
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'hashedPassword',
      birthday: new Date(),
      gender: 'male'
    }
    const mockAuthDto = {
      email: 'test@test.com',
      password: 'password',
    }
    const mockTokens = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    }

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as User & Document & { _id: mongoose.Types.ObjectId })    
    jest.spyOn(userService, 'userLoggedIn').mockResolvedValue(undefined)
    jest.spyOn(service, 'getTokens').mockResolvedValue(mockTokens)
    jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined)

    const result = await service.logIn(mockAuthDto)

    expect(result).toBeDefined()
    expect(result).toEqual(mockTokens)
  })

  it('should log out a user', async () => {
    const mockUserID = '123'

    const userServiceUpdateSpy = jest.spyOn(userService, 'update').mockResolvedValue(undefined)

    await service.logOut(mockUserID)

    expect(userServiceUpdateSpy).toHaveBeenCalledWith(mockUserID, { refreshToken: null })
  })

  it('should hash data', async () => {
    const testData = 'testData'
    const mockHash = 'hashedData'
    const argon2Mock = jest.spyOn(argon2, 'hash').mockImplementation(() => Promise.resolve(mockHash))
    const result = await service.hashData(testData)

    expect(argon2Mock).toHaveBeenCalledWith(testData)
    expect(result).toBe(mockHash)

    argon2Mock.mockRestore()
  })

  it('should update refresh token', async () => {
    const mockUserID = '123'
    const mockRefreshToken = 'refreshToken'
    const mockHashedRefreshToken = 'hashedRefreshToken'

    const argon2Mock = jest.spyOn(argon2, 'hash').mockImplementation(() => Promise.resolve(mockHashedRefreshToken))
    const userServiceUpdateSpy = jest.spyOn(userService, 'update').mockResolvedValue(undefined)

    await service.updateRefreshToken(mockUserID, mockRefreshToken)

    expect(argon2Mock).toHaveBeenCalledWith(mockRefreshToken)
    expect(userServiceUpdateSpy).toHaveBeenCalledWith(mockUserID, { refreshToken: mockHashedRefreshToken })
  })

  it('should get tokens', async () => {
    service = new AuthService(userService, jwtService, configService)

    const mockUserID = '123'
    const mockEmail = 'test@example.com'
    const mockAccessToken = 'accessToken'
    const mockRefreshToken = 'refreshToken'

    const jwtServiceSignAsyncSpy = jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(mockAccessToken).mockResolvedValueOnce(mockRefreshToken)
    const configServiceGetSpy = jest.spyOn(configService, 'get').mockReturnValueOnce('JWT_ACCESS_SECRET').mockReturnValueOnce('JWT_REFRESH_SECRET')

    const result = await service.getTokens(mockUserID, mockEmail)

    expect(jwtServiceSignAsyncSpy).toHaveBeenCalledTimes(2)
    expect(configServiceGetSpy).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    })
  })

  it('should get reset token', async () => {
    const mockEmail = 'test@test.com'
    const mockUser: Partial<User & Document> = {
      _id: new mongoose.Types.ObjectId(),
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'Password123',
      birthday: new Date(),
      gender: 'male',
    }
    const mockResetToken = 'resetToken'

    const userServiceFindByEmailSpy = jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as User & Document & { _id: mongoose.Types.ObjectId })
    const jwtServiceSignAsyncSpy = jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockResetToken)
    const configServiceGetSpy = jest.spyOn(configService, 'get').mockReturnValue('JWT_RESET_SECRET')
    const result = await service.getResetToken(mockEmail)

    expect(userServiceFindByEmailSpy).toHaveBeenCalledWith(mockEmail)
    expect(jwtServiceSignAsyncSpy).toHaveBeenCalledWith(
      { sub: mockUser._id, email: mockEmail },
      { secret: 'JWT_RESET_SECRET', expiresIn: '2h' }
    )
    expect(configServiceGetSpy).toHaveBeenCalledWith('JWT_RESET_SECRET')
    expect(result).toBe(mockResetToken)
  })

  it('should throw an error if user does not exist', async () => {
    const mockEmail = 'test@example.com'

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)

    await expect(service.getResetToken(mockEmail)).rejects.toThrow(BadRequestException)
  })

  it('should refresh tokens', async () => {
    const mockUserID = '123'
    const mockRefreshToken = 'refreshToken'
    const mockUser: Partial<User & Document> = {
      _id: mockUserID,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'hashedPassword',
      birthday: new Date(),
      gender: 'male',
      refreshToken: mockRefreshToken,
    }
    const mockTokens = { accessToken: 'accessToken', refreshToken: 'newRefreshToken' }

    const userServiceFindOneSpy = jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser as User & Document & { _id: mongoose.Types.ObjectId })
    const argon2VerifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(true)
    const getTokensSpy = jest.spyOn(service, 'getTokens').mockResolvedValue(mockTokens)
    const updateRefreshTokenSpy = jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined)

    const result = await service.refreshTokens(mockUserID, mockRefreshToken)

    expect(userServiceFindOneSpy).toHaveBeenCalledWith(mockUserID)
    expect(argon2VerifySpy).toHaveBeenCalledWith(mockUser.refreshToken, mockRefreshToken)
    expect(getTokensSpy).toHaveBeenCalledWith(mockUser.id, mockUser.email)
    expect(updateRefreshTokenSpy).toHaveBeenCalledWith(mockUser.id, mockTokens.refreshToken)
    expect(result).toEqual(mockTokens)
  })

  it('should throw an error if user does not exist or refresh token does not match', async () => {
    const mockUserID = '123'
    const mockRefreshToken = 'refreshToken'

    jest.spyOn(userService, 'findOne').mockResolvedValue(null)
    jest.spyOn(argon2, 'verify').mockResolvedValue(false)

    await expect(service.refreshTokens(mockUserID, mockRefreshToken)).rejects.toThrow(ForbiddenException)
  })
})