import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enum';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('category')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return await this.categoryService.findAllCategories();
  }

  @Post()
  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(await this.categoryService.createCategory(createCategoryDto));
  }
}
