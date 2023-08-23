import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ReturnFullProductDto } from './dtos/return-full-product.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService
  ) {}


  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0) {
      throw new NotFoundException('Products Empty')
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return (await this.productRepository.save({
      ...createProduct
    }));
  }

  async deleteProduct(productId: number): Promise<void> {
    await this.productRepository.delete(productId)
      .then(result => {
        if (result.affected === 0)
          throw new NotFoundException(`Product id: ${productId} not found.`);
      });
  }

  async updateProduct(updateProduct: UpdateProductDto, productId: number): Promise<ReturnFullProductDto> {
    const product: ProductEntity = await this.findProductById(productId);

    return await this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async findProductById(productId: number): Promise<ProductEntity> {
    return await this.productRepository.findOne({
      where: {
        id: productId
      }
    }).then(product => {
      if (!product) {
        throw new NotFoundException(`Product id: ${productId} not found.`)
      }

      return product;
    })
  }

}
