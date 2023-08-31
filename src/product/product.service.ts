import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorreiosService } from 'src/correios/correios.service';
import { CdServiceEnum } from 'src/correios/enums/cd-service.enum';
import { ProductMeasurementsDto } from 'src/correios/enums/product-measurements.dto';
import { ILike, In, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoryCount } from './dtos/product-category-count';
import { ReturnProductDeliveryPriceDto } from './dtos/return-product-delivery-price.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly correiosService: CorreiosService
  ) {}

  async findAllPage(search?: string): Promise<ProductEntity[]> {
    let findOptions = {};

    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`),
        }
      }
    }
    const products = await this.productRepository.find(findOptions)

    if (!products || products.length === 0) {
      throw new NotFoundException('Products Empty')
    }

    return products;
  }

  async findAll(
    productId?: number[], relations?: boolean): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        }
      }
    }

    if (relations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true
        }
      }
    }

    const products = await this.productRepository.find(findOptions)

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

  async updateProduct(updateProduct: UpdateProductDto, productId: number): Promise<ProductEntity> {
    const product: ProductEntity = await this.findProductById(productId);

    return await this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async findProductById(productId: number, isRelations?: boolean): Promise<ProductEntity> {
    const relations = isRelations ? {
      category: true,
    } : undefined;

    return await this.productRepository.findOne({
      where: {
        id: productId
      },
      relations
    }).then(product => {
      if (!product) {
        throw new NotFoundException(`Product id: ${productId} not found.`)
      }

      return product;
    })
  }

  async countProductsByCategoryId(): Promise<CategoryCount[]> {
    return this.productRepository.createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }

  async findDeliveryPrice(cep: string, productId: number): Promise<any> {
    const product = await this.findProductById(productId);
    const productMeasurements = new ProductMeasurementsDto(product);
    const deliveryPrices = await Promise.all([
      this.correiosService.findDeliveryPrice(CdServiceEnum.PAC, cep, productMeasurements),
      this.correiosService.findDeliveryPrice(CdServiceEnum.SEDEX, cep, productMeasurements),
      this.correiosService.findDeliveryPrice(CdServiceEnum.SEDEX_10, cep, productMeasurements)]
    ).catch(() => {
      throw new BadRequestException('Error to retrieve delivery price.')
    });

    return new ReturnProductDeliveryPriceDto(deliveryPrices);
  }
}
