import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { ReturnProductDeliveryPriceDto } from './dtos/return-product-delivery-price.dto';
import { ReturnProductDto } from './dtos/return-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { Pagination } from 'src/dtos/pagination.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}


  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll([], true)).map(product => new ReturnProductDto(product));
  }

  @Get('/page')
  async findAllPaged(
    @Query('search') search?: string,
    @Query('size') size?: number,
    @Query('page') page?: number): Promise<Pagination<ReturnProductDto[]>> {
    return (await this.productService.findAllPage(search, size, page))
    //.map(product => new ReturnProductDto(product));
  }

  @Get('/:productId/delivery/:cep')
  async findDeliveryPrice(@Param('productId') productId: number, @Param('cep') cep: string): Promise<ReturnProductDeliveryPriceDto> {
    return this.productService.findDeliveryPrice(cep, productId);
  }

  @Get('/:productId')
  async findProductById(@Param('productId') productId: number): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productService.findProductById(productId, true));
  }

  @Post()
  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.createProduct(createProductDto);
  }

  @Put('/:productId')
  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId: number): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProductDto, productId);
  }

  @Delete('/:productId')
  @Roles(UserType.Admin, UserType.Root)
  async deleteProduct(@Param('productId') productId: number): Promise<void> {
    await this.productService.deleteProduct(productId);
  }
}
