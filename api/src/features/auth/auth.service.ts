import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.userService.findByEmail(createUserDto.email)

    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    const hash = await this.hasData(createUserDto.password)
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash
    })

    const tokens = await this.getTokens(newUser._id, newUser.email)
    await this.updateRefreshToken(newUser._id, tokens.refreshToken)

    return tokens
  }

  async logIn(data: AuthDto) {
    const user = await this.userService.findByEmail(data.email)

    if (!user) throw new BadRequestException('User does not exist')
    
    const passwordMatches = await argon2.verify(user.password, data.password)

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect')
    }

    await this.userService.userLoggedIn(user._id)

    const tokens = await this.getTokens(user._id, user.email)

    await this.updateRefreshToken(user._id, tokens.refreshToken)

    return tokens
   
  }

  async logOut(userID: string) {
    return this.userService.update(userID, { refreshToken: null })
  }

  async hasData(data: string) {
    return await argon2.hash(data)
  }
  
  async updateRefreshToken(userID: any, refreshToken: any) {
    const hashedRefreshToken = await this.hasData(refreshToken)
    await this.userService.update(userID, {
      refreshToken: hashedRefreshToken,
    })
  }

  async getTokens(userId: any, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async getResetToken(email: string) {
    const user = await this.userService.findByEmail(email)

    if(!user) {
      throw new BadRequestException('User does not exist')
    }

    const resetToken = await this.jwtService.signAsync(
      {
        sub: user._id,
        email
      },
      {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
        expiresIn: '2h'
      }
    )

    return resetToken
  }

  async refreshTokens(userID: any, refreshToken: string) {
    const user = await this.userService.findOne(userID)

    if(!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied')
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    )

    if(!refreshTokenMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

}
