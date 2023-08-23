import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { ReturnFullProductDto } from './dtos/return-full-product.dto';
import { ReturnProductDto } from './dtos/return-product.dto';
import { ProductService } from './product.service';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll()).map(product => new ReturnProductDto(product));
  }

  @Post()
  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ReturnFullProductDto> {
    return new ReturnFullProductDto(await this.productService.createProduct(createProductDto));
  }
}
