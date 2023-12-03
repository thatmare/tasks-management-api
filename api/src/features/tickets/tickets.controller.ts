import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { AccessTokenGuard } from '../auth/guards'
import { Request } from 'express'

interface AuthenticatedRequest extends Request {
  user: {
    sub: string; 
    refreshToken: string; 
  };
}

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    const email = req.user['email']

    return this.ticketsService.create(createTicketDto, email)
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.ticketsService.findAll()
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('user')
  findByUser(@Req() req: AuthenticatedRequest) {
    const email = req.user['email']

    return this.ticketsService.findByUser(email)
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':category')
  findByCategory(@Param('category') category: string) {

    return this.ticketsService.filterByCategory(category)
  }
  

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id)
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto)
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.softDelete(id)
  }
}
