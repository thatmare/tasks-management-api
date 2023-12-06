import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { AccessTokenGuard } from '../auth/guards'
import { Request } from 'express'
import { PaginationParams } from './dto/pagination.dto'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string; 
    refreshToken: string; 
  };
}

@ApiTags('tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    const email = req.user['email']

    return this.ticketsService.create(createTicketDto, email)
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() paginationParams: PaginationParams) {
    return this.ticketsService.findAll(paginationParams)
  }

  @UseGuards(AccessTokenGuard)
  @Get('user')
  findByUser(@Req() req: AuthenticatedRequest) {
    const email = req.user['email']

    return this.ticketsService.findByUser(email)
  }

  @UseGuards(AccessTokenGuard)
  @Get(':category')
  findByCategory(@Param('category') category: string) {
    return this.ticketsService.filterByCategory(category)
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Req() req: AuthenticatedRequest) {
    const ticket = await this.ticketsService.findOne(id)
    if(ticket.asignee['_id'] !== req.user['sub']) {
      throw new ForbiddenException('You are not allowed to update this ticket')
    }

    return this.ticketsService.update(id, updateTicketDto)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const ticket = await this.ticketsService.findOne(id)
    if(ticket.asignee['_id'] !== req.user['sub']) {
      throw new ForbiddenException('You are not allowed to delete this ticket')
    }

    return this.ticketsService.softDelete(id)
  }
}
