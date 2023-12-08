import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { AccessTokenGuard } from '../auth/guards'
import { CategoryResponse } from './utils/categories.response'

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOkResponse({ type: CategoryResponse })
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @ApiOkResponse({ type: CategoryResponse })
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query('order') sortOptions: 'asc' | 'desc' = 'asc') {
    return this.categoriesService.findAll(sortOptions)
  }

  @ApiOkResponse({ type: CategoryResponse })
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id)
  }

  @ApiOkResponse({ type: CategoryResponse })
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }
}
