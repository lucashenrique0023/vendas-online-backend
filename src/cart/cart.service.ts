import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartDto } from './dtos/cart.dto';
import { CartProductService } from 'src/cart_product/cart_product.service';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(CartEntity) private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService
  ) {}


  async createCart(cart: CartDto, userId: number): Promise<CartEntity> {
    return await this.cartRepository.save({
      active: true,
      userId,
    })
  }

  async insertProduct(cartDto: CartDto, userId: number): Promise<CartEntity> {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.createCart(cartDto, userId);
    });

    await this.cartProductService.insertCartProduct(cartDto, cart);

    return this.findCartByUserId(userId, true);
  }

  async findCartByUserId(userId: number, isRelations?: boolean): Promise<CartEntity> {
    const relations = isRelations ? {
      cartProduct: {
        product: true
      }
    } : undefined;

    return await this.cartRepository.findOne({
      where: {
        userId,
        active: true
      },
      relations
    }).then(cart => {
      if (!cart) {
        throw new NotFoundException(`No cart active found for user.`)
      }

      return cart;
    })
  }
}
