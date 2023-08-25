import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  exports: [PaymentService],
  providers: [PaymentService]
})
export class PaymentModule {}
