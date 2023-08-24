import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { CartDto } from 'src/cart/dtos/cart.dto';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartProductService {

  constructor(@InjectRepository(CartProductEntity)
  private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService) {}

  async verifyProductInCart(productId: number, cartId: number): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      }
    });

    if (!cartProduct) {
      throw new NotFoundException(`Cart does not contain the specified product`)
    }

    return cartProduct;

  }

  async createCartProduct(cartDto: CartDto, cartId: number): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      amount: cartDto.amount,
      productId: cartDto.productId,
      cartId,
    })
  }

  async insertCartProduct(cartDto: CartDto, cartEntity: CartEntity): Promise<CartProductEntity> {
    await this.productService.findProductById(cartDto.productId);

    const cartProduct = await this.verifyProductInCart(cartDto.productId, cartEntity.id)
      .catch(() => undefined);

    if (!cartProduct) {
      return await this.createCartProduct(cartDto, cartEntity.id)
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + cartDto.amount,
    })
  }

}
