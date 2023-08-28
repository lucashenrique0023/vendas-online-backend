import { ReturnUserDto } from "src/user/dtos/returnUser.dto";
import { OrderEntity } from "../entities/order.entity";

export class ReturnOrderDto {
  id: number;
  date: Date;
  user?: ReturnUserDto;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.createdAt;
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
  }
}