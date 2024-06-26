import { Controller, Get, Post, Body, UseGuards, Req, BadRequestException} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { AccessTokenGuard, RefreshTokenGuard } from './guards'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { TypedEventEmitter } from '../emails/event-emitter/typed-event-emitter.class' 

interface AuthenticatedRequest extends Request {
  user: {
    sub: string; 
    refreshToken: string; 
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: TypedEventEmitter
    ) {}

  @Post('login')
  logIn(@Body() data: AuthDto) {
    return this.authService.logIn(data)
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('logout')
  logOut(@Req() req: AuthenticatedRequest) {
    return this.authService.logOut(req.user['sub'])
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Get('resign')
  refreshTokens(@Req() req: AuthenticatedRequest) {
    const userID = req.user['sub']
    const refreshToken = req.user['refreshToken']

    return this.authService.refreshTokens(userID, refreshToken)
  }

  @Post('reset-password')
  async requestResetPasswordToken(@Body('email') email: string) {

    try {
      const resetToken = await this.authService.getResetToken(email)

      this.eventEmitter.emit('auth.reset-password', {
        name: 'Marissa',
        email: email,
        token: resetToken
      })
    } catch (error) {
      if(error instanceof BadRequestException) {
        throw new BadRequestException('User does not exist')
      }

      throw error
    }
  }
}
