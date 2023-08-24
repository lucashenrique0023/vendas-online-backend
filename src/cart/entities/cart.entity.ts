import { CartProductEntity } from "src/cart_product/entities/cart-product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cart' })
export class CartEntity {

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CartProductEntity, (cartProductEntity: CartProductEntity) => cartProductEntity.cart)
  cartProduct?: CartProductEntity[];

}