import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  image: string;
}