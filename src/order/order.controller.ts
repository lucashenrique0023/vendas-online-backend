import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/userId.decorator';

@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(@Body() createOrderDto: CreateOrderDTO,
    @UserId() userId) {
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
