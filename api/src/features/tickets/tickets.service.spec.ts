import { Test, TestingModule } from '@nestjs/testing'
import { TicketsService } from './tickets.service'
import { UsersService } from '../users/users.service'

describe('TicketsService', () => {
  let ticketService: TicketsService
  let mockTicketModel: any
  let mockDeletedTicketModel: any
  let mockUserModel: any

  beforeEach(async () => {
    mockTicketModel = {
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
    }

    mockDeletedTicketModel = {
      save: jest.fn(),
    }

    mockUserModel = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        UsersService,
        { provide: 'TicketModel', useValue: mockTicketModel },
        { provide: 'DeletedTicketModel', useValue: mockDeletedTicketModel },
        { provide: 'UserModel', useValue: mockUserModel },
      ],
    }).compile()

    ticketService = module.get<TicketsService>(TicketsService)
  })

  it('should call findOne on the ticketModel with correct parameters', async () => {
    const id = 'some-id'
    await ticketService.findOne(id)
    expect(mockTicketModel.findOne).toHaveBeenCalledWith({ _id: id, isDeleted: false })
  })

  it('should return the result of ticketModel.findOne', async () => {
    const id = 'some-id'
    const expectedResult = { _id: id, isDeleted: false }
    mockTicketModel.findOne.mockReturnValue(expectedResult)
    const result = await ticketService.findOne(id)
    expect(result).toBe(expectedResult)
  })

  it('should call findByIdAndUpdate on the ticketModel with correct parameters when updating', async () => {
    const id = 'some-id'
    const updateTicketDto = { title: 'new title' }
    await ticketService.update(id, updateTicketDto)
    expect(mockTicketModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateTicketDto, { new: true })
  })

  it('should return the result of ticketModel.findByIdAndUpdate when updating', async () => {
    const id = 'some-id'
    const updateTicketDto = { title: 'new title' }
    const expectedResult = { _id: id, ...updateTicketDto }
    mockTicketModel.findByIdAndUpdate.mockReturnValue(expectedResult)
    const result = await ticketService.update(id, updateTicketDto)
    expect(result).toBe(expectedResult)
  })

  it('should call findByIdAndUpdate and deleteOne on the ticketModel with correct parameters when soft deleting', async () => {
    const id = 'some-id'
    await ticketService.softDelete(id)
    expect(mockTicketModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: { isDeleted: true, deletedAt: expect.any(Date) } }, { new: true })
    expect(mockTicketModel.deleteOne).toHaveBeenCalledWith({ _id: id })
  })

  it('should return the result of ticketModel.findByIdAndUpdate when soft deleting', async () => {
    const id = 'some-id'
    const expectedResult = { _id: id, isDeleted: true, deletedAt: new Date() }
    mockTicketModel.findByIdAndUpdate.mockReturnValue(expectedResult)
    const result = await ticketService.softDelete(id)
    expect(result).toBe(expectedResult)
  })
})
