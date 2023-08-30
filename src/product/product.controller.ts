import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { ReturnFullProductDto } from './dtos/return-full-product.dto';
import { ReturnProductDto } from './dtos/return-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dtos/update-product.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll([], true)).map(product => new ReturnProductDto(product));
  }

  @Get('/:productId/delivery/:cep')
  async findDeliveryPrice(@Param('productId') productId: number, @Param('cep') cep: string): Promise<any> {
    return this.productService.findDeliveryPrice(cep, productId);
  }

  @Post()
  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ReturnFullProductDto> {
    return new ReturnFullProductDto(await this.productService.createProduct(createProductDto));
  }

  @Put('/:productId')
  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId: number): Promise<ReturnFullProductDto> {
    return new ReturnFullProductDto(await this.productService.updateProduct(updateProductDto, productId));
  }

  @Delete('/:productId')
  @Roles(UserType.Admin)
  async deleteProduct(@Param('productId') productId: number): Promise<void> {
    await this.productService.deleteProduct(productId);
  }
}
