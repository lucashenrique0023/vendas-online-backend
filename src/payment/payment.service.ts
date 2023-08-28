import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dtos/create-order.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from 'src/payment_status/enums/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartProductEntity } from 'src/cart_product/entities/cart-product.entity';

@Injectable()
export class PaymentService {

  constructor(@InjectRepository(PaymentEntity)
  private readonly paymentRepository: Repository<PaymentEntity>) {}

  calculateFinalPrice(cart: CartEntity, products: ProductEntity[]): number {
    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      return 0;
    }

    return cart.cartProduct.map((cartProduct: CartProductEntity) => {
      const product = products.find((product) => product.id === cartProduct.productId);
      if (product) {
        return cartProduct.amount * product.price;
      }

      return 0;
    }).reduce((acumulator, currentValue) => acumulator + currentValue, 0);
  }

  async createPayment(createOrderDto: CreateOrderDTO,
    products: ProductEntity[], cart: CartEntity): Promise<PaymentEntity> {

    const finalPrice: number = this.calculateFinalPrice(cart, products);
    if (createOrderDto.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(PaymentType.Done, finalPrice, 0, finalPrice, createOrderDto);
      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDto.codePix && createOrderDto.datePayment) {
      const paymentPix = new PaymentPixEntity(PaymentType.Done, finalPrice, 0, finalPrice, createOrderDto);
      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException('Amount Payments or Pix Payment not found');
  }
}
