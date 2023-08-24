import { ReturnCartProductDto } from "src/cart_product/dtos/return-cart-product.dto";
import { CartEntity } from "../entities/cart.entity";

export class ReturnCartDto {

  id: number;
  cartProduct?: ReturnCartProductDto[];

  constructor(cartEntity: CartEntity) {
    this.id = cartEntity.id;
    this.cartProduct = cartEntity.cartProduct ?
      cartEntity.cartProduct.map(cartProduct => new ReturnCartProductDto(cartProduct)) :
      undefined;
  }

}