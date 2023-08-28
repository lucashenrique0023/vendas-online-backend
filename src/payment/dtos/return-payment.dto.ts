import { ReturnPaymentStatusDto } from "src/payment_status/dtos/return-payment-status.dto";
import { PaymentEntity } from "../entities/payment.entity";

export class ReturnPaymentDto {
  id: number;
  statusId: number;
  price: number;
  discount: number;
  finalPrice: number;
  type: string;
  status?: ReturnPaymentStatusDto;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.statusId = payment.statusId;
    this.price = payment.price;
    this.discount = payment.discount;
    this.finalPrice = payment.finalPrice;
    this.type = payment.type;
    this.status = payment.status ? new ReturnPaymentStatusDto(payment.status) : undefined;
  }
}