import { CartProductEntity } from 'src/cart_product/entities/cart-product.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProductEntity } from 'src/order_product/entities/order-product.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @Column({ name: 'name', nullable: false })
  name: string

  @Column({ name: 'price', type: 'decimal', nullable: false })
  price: number;

  @Column({ name: 'image', nullable: false })
  image: string;

  @Column({ name: 'weight', type: 'decimal', nullable: false })
  weight: number;

  @Column({ name: 'length', type: 'decimal', nullable: false })
  length: number;

  @Column({ name: 'height', type: 'decimal', nullable: false })
  height: number;

  @Column({ name: 'width', type: 'decimal', nullable: false })
  width: number;

  @Column({ name: 'diameter', type: 'decimal', nullable: false })
  diameter: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CartProductEntity, (cartProductEntity: CartProductEntity) => cartProductEntity.product)
  cartProduct?: CartProductEntity[];

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
  )
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.product)
  ordersProduct?: OrderProductEntity[];
}
