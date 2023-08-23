import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories empty')
    }

    return categories;
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId
      }
    })

    if (!category) {
      throw new NotFoundException(`Category id: ${categoryId} not found.`)
    }

    return category
  }

  async createCategory(createCategory: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategory.name);

    if (category) {
      throw new ConflictException(`Category name '${createCategory.name}' already exists.`)
    }

    return await this.categoryRepository.save(createCategory);

  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {

    if (name === undefined || name === null || name.length === 0) {
      throw new BadRequestException(`Category must have a value.`);
    }

    return await this.categoryRepository.findOne({
      where: {
        name,
      }
    });
  }
}
