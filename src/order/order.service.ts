import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderProductService } from 'src/order_product/order_product.service';
import { ProductService } from 'src/product/product.service';
import { OrderProductEntity } from 'src/order_product/entities/order-product.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {

  constructor(@InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService) {}

  async createOrder(createOrderDto: CreateOrderDTO, userId: number): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(userId, true);
    const products = await this.productService.findAll(cart.cartProduct?.map((cartProduct) => cartProduct.productId));
    const payment: PaymentEntity = await this.paymentService.createPayment(createOrderDto, products, cart);
    const order = await this.saveOrder(createOrderDto, userId, payment);
    await this.createOrderProductUsingCart(cart, order.id, products);
    await this.cartService.clearCart(cart);
    return order;
  }

  async saveOrder(createOrderDto: CreateOrderDTO, userId: number, payment: PaymentEntity): Promise<OrderEntity> {
    return this.orderRepository.save({
      addressId: createOrderDto.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }

  async createOrderProductUsingCart(cart: CartEntity, orderId: number, products: ProductEntity[]): Promise<OrderProductEntity[]> {
    return await Promise.all(
      cart.cartProduct?.map((cartProduct) => this.orderProductService.createOrderProduct(
        cartProduct.productId,
        orderId,
        products.find((product) => product.id === cartProduct.productId)?.price || 0,
        cartProduct.amount)
      )
    );
  }

}
