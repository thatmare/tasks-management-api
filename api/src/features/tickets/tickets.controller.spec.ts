import { Test, TestingModule } from '@nestjs/testing'
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'

// Add these imports
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { PaginationParams } from './dto/pagination.dto'
import { ForbiddenException } from '@nestjs/common'
import { AuthenticatedRequest } from './tickets.controller'

// Mock the TicketsService
jest.mock('./tickets.service')

describe('TicketsController', () => {
  let controller: TicketsController
  let service: TicketsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [TicketsService],
    }).compile()


    controller = module.get<TicketsController>(TicketsController)
    service = module.get<TicketsService>(TicketsService)
  })

  it('should create a ticket', async () => {
    const dto = new CreateTicketDto()
    const result = {}
    jest.spyOn(service, 'create').mockResolvedValue(result as any)
    expect(await controller.create(dto, { user: { email: 'test@test.com' } })).toBe(result)
  })

  it('should find all tickets', async () => {
    const params = new PaginationParams()
    const result = { results: [], count: 0 }
    jest.spyOn(service, 'findAll').mockResolvedValue(Promise.resolve(result))
    expect(await controller.findAll(params)).toBe(result)
  })

  // it('should find tickets by user', async () => {
  //   const result = []
  //   jest.spyOn(service, 'findByUser').mockResolvedValue(result)
  //   expect(await controller.findByUser({ user: { email: 'test@test.com' } })).toBe(result)
  // })

  it('should find tickets by category', async () => {
    const result = []
    jest.spyOn(service, 'filterByCategory').mockResolvedValue(result)
    expect(await controller.findByCategory('test')).toBe(result)
  })

  it('should update a ticket', async () => {
    const mockRequest = {
      user: { sub: 'test', refreshToken: 'someToken' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      // add other properties as needed
    } as unknown as AuthenticatedRequest

    const dto = new UpdateTicketDto()
    const result = {}
    jest.spyOn(service, 'findOne').mockResolvedValue({ asignee: { _id: 'test' } } as any)
    jest.spyOn(service, 'update').mockResolvedValue(result as any)
    expect(await controller.update('test', dto, mockRequest)).toBe(result)
  })

  it('should throw an error when updating a ticket not assigned to the user', async () => {
    const mockRequest = {
      user: { sub: 'test', refreshToken: 'someToken' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      // add other properties as needed
    } as unknown as AuthenticatedRequest

    const dto = new UpdateTicketDto()
    jest.spyOn(service, 'findOne').mockResolvedValue({ asignee: { _id: 'test' } } as any)
    await expect(controller.update('test', dto, mockRequest)).rejects.toThrow(ForbiddenException)
  })

  it('should remove a ticket', async () => {
    const mockRequest = {
      user: { sub: 'test', refreshToken: 'someToken' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      // add other properties as needed
    } as unknown as AuthenticatedRequest

    const result = {}
    jest.spyOn(service, 'findOne').mockResolvedValue({ asignee: { _id: 'test' } } as any)
    jest.spyOn(service, 'softDelete').mockResolvedValue(result as any)
    expect(await controller.remove('test', mockRequest)).toBe(result)
  })

  it('should throw an error when removing a ticket not assigned to the user', async () => {
    const mockRequest = {
      user: { sub: 'test', refreshToken: 'someToken' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      // add other properties as needed
    } as unknown as AuthenticatedRequest


    jest.spyOn(service, 'findOne').mockResolvedValue({ asignee: { _id: 'test' } } as any)
    await expect(controller.remove('test', mockRequest)).rejects.toThrow(ForbiddenException)
  })
})
