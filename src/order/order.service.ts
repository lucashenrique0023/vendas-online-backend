import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOrdersByUserId(userId: number): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        userId
      },
      relations: {
        address: true,
        ordersProduct: {
          product: true,
        },
        payment: {
          status: true,
        }
      }
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders Not Found');

    }
    return orders;
  }

  async findOrderById(orderId: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId
      },
      relations: {
        address: true,
        ordersProduct: {
          product: true,
        },
        payment: {
          status: true,
        },
        user: true
      }
    });

    if (!order) {
      throw new NotFoundException(`Order: ${orderId} not found.`)
    }

    return order;
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: {
        user: true
      }
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders not found');
    }

    const ordersProduct = await this.orderProductService
      .findProductAmountByOrderId(orders.map((order) => order.id));

    console.log('ordersProduct', ordersProduct);
    console.log('orders', orders)

    return orders.map((order) => {
      const orderProduct = ordersProduct.find((currentOrder) => currentOrder.order_id === order.id);

      if (orderProduct) {
        return {
          ...order,
          amountProducts: Number(orderProduct.total)
        }
      }

      return order;
    });
  }

}
