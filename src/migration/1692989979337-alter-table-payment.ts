import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTablePayment1692989979337 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        ALTER TABLE public.payment ALTER COLUMN amount_payments DROP NOT NULL;
        ALTER TABLE public.payment ALTER COLUMN code DROP NOT NULL;
        ALTER TABLE public.payment ALTER COLUMN date_payment DROP NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(``);
    }

}
