import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AccessTokenGuard } from '../auth/guards'
import { Request } from 'express'
import { UserResponse } from './utils/user.response'

export interface RequestWithUser extends Request {
  user: any
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResponse })  
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @ApiOkResponse({ type: UserResponse })  
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @ApiOkResponse({ type: UserResponse })  
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @ApiOkResponse({ type: UserResponse })  
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    if(req.user.sub !== id) {
      throw new Error('You are not authorized to update this user')
    }

    return this.usersService.update(id, updateUserDto)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    if(req.user.sub !== id) {
      throw new Error('You are not authorized to delete this user')
    }
    return this.usersService.remove(id)
  }
}
