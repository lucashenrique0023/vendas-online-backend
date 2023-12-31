import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ProductModule],
  exports: [CategoryService],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
