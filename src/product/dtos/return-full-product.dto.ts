import { ProductEntity } from "../entities/product.entity";

export class ReturnFullProductDto {
  id: number;
  categoryId: number;
  name: string
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.categoryId = productEntity.categoryId;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
  }
}