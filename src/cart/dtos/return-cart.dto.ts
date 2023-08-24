import { CartProductEntity } from "src/cart_product/entities/cart-product.entity";
import { CartEntity } from "../entities/cart.entity";

export class ReturnCartDto {

  id: number;
  userId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  cartProduct?: CartProductEntity[];

  constructor(cartEntity: CartEntity) {
    this.id = cartEntity.id;
    this.userId = cartEntity.userId;
    this.active = cartEntity.active;
    this.createdAt = cartEntity.createdAt;
    this.updatedAt = cartEntity.updatedAt;
    this.cartProduct = cartEntity?.cartProduct;
  }

}