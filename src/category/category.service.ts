import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CategoryCount } from 'src/product/dtos/product-category-count';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly productService: ProductService,
  ) {}

  findCategoryAmountInProducts(category: CategoryEntity, countList: CategoryCount[]): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const categoryCount: CategoryCount[] = await this.productService.countProductsByCategoryId();


    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories empty')
    }

    return categories.map((category) => new ReturnCategoryDto(category, this.findCategoryAmountInProducts(category, categoryCount)));
  }

  async findCategoryById(categoryId: number, isRelations?: boolean): Promise<CategoryEntity> {
    const relations = isRelations ?
      {
        products: true,
      } : undefined;

    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId
      },
      relations,
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

  async deleteCategory(categoryId: number): Promise<void> {
    const category = await this.findCategoryById(categoryId, true);

    if (category?.products?.length > 0) {
      throw new BadRequestException(`There are products using category id: ${categoryId}.`);
    }

    return this.categoryRepository.delete(categoryId)
      .then(result => {
        if (result.affected === 0)
          throw new NotFoundException(`Category id: ${categoryId} not found.`);
      });;
  }
}
