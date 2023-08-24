import { ChildEntity, Column } from "typeorm";
import { PaymentEntity } from "./payment.entity";

@ChildEntity()
export abstract class PaymentCreditCardEntity extends PaymentEntity {

  @Column({ name: 'amount_payments', nullable: false })
  amountPayments: number;

}