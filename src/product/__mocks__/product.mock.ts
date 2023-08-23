import { categoryMock } from "../../category/__mocks__/category.mock";
import { ProductEntity } from "../entities/product.entity";

export const productMock: ProductEntity = {
  categoryId: categoryMock.id,
  createdAt: new Date(),
  id: 7474,
  image: 'http://image.com',
  name: 'Product Name',
  price: 45.4,
  updatedAt: new Date(),
}