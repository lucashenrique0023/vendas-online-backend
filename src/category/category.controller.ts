import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('category')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return await this.categoryService.findAllCategories();
  }

  @Get('/:categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(await this.categoryService.findCategoryById(categoryId, true));
  }

  @Put('/:categoryId')
  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoryService.updateCategory(categoryId, updateCategoryDto)
    );
  }

  @Post()
  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(await this.categoryService.createCategory(createCategoryDto));
  }

  @Delete('/:categoryId')
  @Roles(UserType.Admin, UserType.Root)
  async deleteCategory(@Param('categoryId') categoryId: number): Promise<void> {
    await this.categoryService.deleteCategory(categoryId);
  }
}
