import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesEntity } from '../../entities/category.entity';
import { Category } from '../../schemas/category.schema';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.Admin)
  @ApiOperation({summary:'Create category'})
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'create category',
    type:Category
  })
  async create(@Body() createCategoryDto: CreateCategoryDto):Promise<Category> {
    return await this.categoriesService.create({
      ...createCategoryDto
    });
  }

  @Get()
  @ApiOperation({summary:'Get all categories'})
  @ApiResponse({
    status: 200,
    description: 'get all categories',
    type:[Category]
  })
  async findAll():Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary:'Get category by id'})
  @ApiResponse({
    status: 200,
    description: 'get category by id',
    type:Category
  })
  async findOne(@Param('id') id: string):Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({summary:'Update category'})
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'update category',
    type:Category
  })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto):Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({summary:'Remove category'})
  @ApiResponse({
    status: 200,
    description: 'remove category',
    type:[Category]
  })
  async remove(@Param('id') id: string):Promise<Category[]> {
    return await this.categoriesService.remove(id);
  }
}
