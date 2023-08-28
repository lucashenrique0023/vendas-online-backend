import { ReturnAddressDto } from "src/address/dtos/returnAddress.dto";
import { ReturnOrderProductDto } from "src/order_product/dtos/return-order-product.dto";
import { ReturnPaymentDto } from "src/payment/dtos/return-payment.dto";
import { ReturnUserDto } from "src/user/dtos/returnUser.dto";
import { OrderEntity } from "../entities/order.entity";

export class ReturnOrderDto {
  id: number;
  date: Date;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDto;
  ordersProduct?: ReturnOrderProductDto[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.createdAt;
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address ? new ReturnAddressDto(order.address) : undefined;
    this.payment = order.payment ? new ReturnPaymentDto(order.payment) : undefined;
    this.ordersProduct = order.ordersProduct ? order.ordersProduct.map((orderProduct) => new ReturnOrderProductDto(orderProduct)) : undefined;
  }
}