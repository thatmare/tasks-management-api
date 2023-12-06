import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

interface RequestWithUser extends Request {
  user: any
}

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) {}

  use(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header not found')
    }

    const token = req.headers.authorization.split(' ')[1]

    const decodedToken = jwt.verify(token, this.configService.get<string>('JWT_ACCESS_SECRET'))
    req.user = decodedToken

    next()
  }
}
