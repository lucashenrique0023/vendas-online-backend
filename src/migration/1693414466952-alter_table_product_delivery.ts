import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableProductDelivery1693414466952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "product" ADD "weight" double precision NOT NULL DEFAULT 0;
            ALTER TABLE "product" ADD "length" double precision NOT NULL DEFAULT 0;
            ALTER TABLE "product" ADD "height" double precision NOT NULL DEFAULT 0;
            ALTER TABLE "product" ADD "width" double precision NOT NULL DEFAULT 0;
            ALTER TABLE "product" ADD "diameter" double precision NOT NULL DEFAULT 0;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        ALTER TABLE "product" DROP "weight";
        ALTER TABLE "product" DROP "length";
        ALTER TABLE "product" DROP "height";
        ALTER TABLE "product" DROP "width";
        ALTER TABLE "product" DROP "diameter";
        `)
    }

}
