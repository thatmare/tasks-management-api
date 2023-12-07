import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypedEventEmitter } from '../emails/event-emitter/typed-event-emitter.class'

describe('AuthController', () => {
  let authController: AuthController
  let authService: any
  let eventEmitter: any

  beforeEach(async () => {
    authService = {
      logIn: jest.fn(),
      signUp: jest.fn(),
      logOut: jest.fn(),
      refreshTokens: jest.fn(),
      getResetToken: jest.fn(),
    }

    eventEmitter = {
      emit: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: TypedEventEmitter, useValue: eventEmitter },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
  })

  it('should call logIn method of authService', async () => {
    const data = { email: 'test@test.com', password: 'test' }
    await authController.logIn(data)
    expect(authService.logIn).toHaveBeenCalledWith(data)
  })

  it('should call signUp method of authService', async () => {
    const createUserDto= {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'Password123',
      birthday: new Date(),
      gender: 'male'
    }
    await authController.signUp(createUserDto)
    expect(authService.signUp).toHaveBeenCalledWith(createUserDto)
  })

  it('should call logOut method of authService', async () => {
    const mockReq = { user: { sub: 'testSub' } }
    await authController.logOut(mockReq as any)
    expect(authService.logOut).toHaveBeenCalledWith(mockReq.user.sub)
  })

  it('should call refreshTokens method of authService', async () => {
    const mockReq = { user: { sub: 'testSub', refreshToken: 'testToken' } }
    await authController.refreshTokens(mockReq as any)
    expect(authService.refreshTokens).toHaveBeenCalledWith(mockReq.user.sub, mockReq.user.refreshToken)
  })

  it('should call getResetToken method of authService and emit event', async () => {
    const testEmail = 'test@test.com'
    const resetToken = 'testToken'
    
    authService.getResetToken.mockResolvedValue(resetToken)
    
    await authController.requestResetPasswordToken(testEmail)
    
    expect(authService.getResetToken).toHaveBeenCalledWith(testEmail)
    expect(eventEmitter.emit).toHaveBeenCalledWith('auth.reset-password', {
      name: 'Marissa',
      email: testEmail,
      token: resetToken
    })
  })
})
