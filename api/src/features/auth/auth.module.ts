import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

//improve importation syntaxis
import { AccessTokenStrategy } from './strategies/access.token.strategies'
import { RefreshTokenStrategy } from './strategies/refresh.token.strategies'
import { AccessTokenGuard } from './guards/access.token.guards'
import { RefreshTokenGuard } from './guards/refresh.token.guards'

import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard
  ],
})
export class AuthModule {}
