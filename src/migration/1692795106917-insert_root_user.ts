import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertRootUser1692795106917 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      INSERT INTO public."user"(name, email, cpf, type_user, phone, password)
      VALUES ('root','root@root.com','92039485768',2,'81997596876','$2b$10$WWdIPa7DzpVSq7OAlW1h0e35LAK9uEoM3JcgiH1oUC.hQikcaQJQi');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM public."user" WHERE email = 'root@root.com';`);
  }

}
