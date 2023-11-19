import { Controller, Get, Post, Body, UseGuards, Req} from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

import { AccessTokenGuard, RefreshTokenGuard } from './guards'

import { CreateUserDto } from '../users/dto/create-user.dto'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string; 
    refreshToken: string; 
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  logIn(@Body() data: AuthDto) {
    return this.authService.logIn(data)
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logOut(@Req() req: AuthenticatedRequest) {
    console.log(req.user)
    return this.authService.logOut(req.user['sub'])
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: AuthenticatedRequest) {
    const userID = req.user['sub']
    const refreshToken = req.user['refreshToken']

    return this.authService.refreshTokens(userID, refreshToken)
  }
}
