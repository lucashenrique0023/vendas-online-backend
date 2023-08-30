import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/userId.decorator';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enum';
import { OrderEntity } from './entities/order.entity';
import { ReturnOrderDto } from './dtos/return-order-dto';

@Controller('order')
@Roles(UserType.User, UserType.Admin, UserType.Root)
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(@Body() createOrderDto: CreateOrderDTO,
    @UserId() userId: number): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  async findOrdersByUserId(@UserId() userId: number): Promise<OrderEntity[]> {
    return this.orderService.findOrdersByUserId(userId);
  }

  @Get('/all')
  @Roles(UserType.Admin, UserType.Root)
  async findAllOrders(): Promise<ReturnOrderDto[]> {
    return (await this.orderService.findAllOrders()).map(order => new ReturnOrderDto(order));
  }

  @Get('/:orderId')
  @Roles(UserType.Admin, UserType.Root)
  async findOrderById(@Param('orderId') orderId: number): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(await this.orderService.findOrderById(orderId));
  }
}
