import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enum';
import { ReturnCartDto } from './dtos/return-cart.dto';
import { CartDto } from './dtos/cart.dto';
import { CartService } from './cart.service';
import { UserId } from 'src/decorators/userId.decorator';
import { UpdateCartDto } from './dtos/update-cart.dto';

@Roles(UserType.User)
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async insertProduct(@Body() cart: CartDto, @UserId() userId): Promise<ReturnCartDto> {
    return new ReturnCartDto(await this.cartService.insertProduct(cart, userId));
  }

  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto> {
    return new ReturnCartDto(await this.cartService.findCartByUserId(userId, true));
  }

  @Delete()
  async clearCart(@UserId() userId: number): Promise<void> {
    const cart = await this.cartService.findCartByUserId(userId);
    return this.cartService.clearCart(cart);
  }

  @Delete('/product/:productId')
  async deleteCartProduct(@Param('productId') productId: number, @UserId() userId: number): Promise<void> {
    return this.cartService.deleteCartProduct(productId, userId);
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async updateCartProduct(@Body() updateCartDto: UpdateCartDto, @UserId() userId): Promise<ReturnCartDto> {
    return new ReturnCartDto(await this.cartService.updateCartProduct(updateCartDto, userId));
  }

}
