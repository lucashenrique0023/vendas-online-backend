import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dtos/create-order.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from 'src/payment_status/enums/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';

@Injectable()
export class PaymentService {

  constructor(@InjectRepository(PaymentEntity)
  private readonly paymentRepository: Repository<PaymentEntity>) {}

  async createPayment(createOrderDto: CreateOrderDTO): Promise<PaymentEntity> {
    if (createOrderDto.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(PaymentType.Done, 0, 0, 0, createOrderDto);
      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDto.codePix && createOrderDto.datePayment) {
      const paymentPix = new PaymentPixEntity(PaymentType.Done, 0, 0, 0, createOrderDto);
      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException('Amount Payments or Pix Payment not found');
  }
}
