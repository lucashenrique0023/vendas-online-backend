import { OrderEntity } from "src/order/entities/order.entity";
import { PaymentStatusEntity } from "src/payment_status/entities/payment-status.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity({ name: 'payment' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PaymentEntity {

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'status_id', nullable: false })
  statusId: number;

  @Column({ name: 'price', type: 'decimal', nullable: false })
  price: number;

  @Column({ name: 'final_price', type: 'decimal', nullable: false })
  finalPrice: number;

  @Column({ name: 'discount', type: 'decimal', nullable: false })
  discount: number;

  @Column({ name: 'type', nullable: false })
  type: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderEntity, (order) => order.payment)
  orders?: OrderEntity[];

  @ManyToOne(() => PaymentStatusEntity, (payment) => payment.payments)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status?: PaymentStatusEntity;

  constructor(statusId: number, price: number, discount: number, finalPrice: number) {
    this.statusId = statusId,
      this.price = price,
      this.discount = discount,
      this.finalPrice = finalPrice
  }
}