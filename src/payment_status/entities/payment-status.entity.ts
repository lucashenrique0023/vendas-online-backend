import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payment_status' })
export class PaymentStatusEntity {

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  cartId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

}