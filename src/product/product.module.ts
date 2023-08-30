import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CorreiosModule } from 'src/correios/correios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => CategoryModule),
    CorreiosModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
