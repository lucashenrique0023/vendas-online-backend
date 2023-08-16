import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertState1692210572406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    INSERT INTO state ("id", "uf", "name") VALUES (1, 'AC', 'Acre');
    INSERT INTO state ("id", "uf", "name") VALUES (2, 'AL', 'Alagoas');
    INSERT INTO state ("id", "uf", "name") VALUES (3, 'AM', 'Amazonas');
    INSERT INTO state ("id", "uf", "name") VALUES (4, 'AP', 'Amapá');
    INSERT INTO state ("id", "uf", "name") VALUES (5, 'BA', 'Bahia');
    INSERT INTO state ("id", "uf", "name") VALUES (6, 'CE', 'Ceará');
    INSERT INTO state ("id", "uf", "name") VALUES (7, 'DF', 'Distrito Federal');
    INSERT INTO state ("id", "uf", "name") VALUES (8, 'ES', 'Espírito Santo');
    INSERT INTO state ("id", "uf", "name") VALUES (9, 'GO', 'Goiás');
    INSERT INTO state ("id", "uf", "name") VALUES (10, 'MA', 'Maranhão');
    INSERT INTO state ("id", "uf", "name") VALUES (11, 'MG', 'Minas Gerais');
    INSERT INTO state ("id", "uf", "name") VALUES (12, 'MS', 'Mato Grosso do Sul');
    INSERT INTO state ("id", "uf", "name") VALUES (13, 'MT', 'Mato Grosso');
    INSERT INTO state ("id", "uf", "name") VALUES (14, 'PA', 'Pará');
    INSERT INTO state ("id", "uf", "name") VALUES (15, 'PB', 'Paraíba');
    INSERT INTO state ("id", "uf", "name") VALUES (16, 'PE', 'Pernambuco');
    INSERT INTO state ("id", "uf", "name") VALUES (17, 'PI', 'Piauí');
    INSERT INTO state ("id", "uf", "name") VALUES (18, 'PR', 'Paraná');
    INSERT INTO state ("id", "uf", "name") VALUES (19, 'RJ', 'Rio de Janeiro');
    INSERT INTO state ("id", "uf", "name") VALUES (20, 'RN', 'Rio Grande do Norte');
    INSERT INTO state ("id", "uf", "name") VALUES (21, 'RO', 'Rondônia');
    INSERT INTO state ("id", "uf", "name") VALUES (22, 'RR', 'Roraima');
    INSERT INTO state ("id", "uf", "name") VALUES (23, 'RS', 'Rio Grande do Sul');
    INSERT INTO state ("id", "uf", "name") VALUES (24, 'SC', 'Santa Catarina');
    INSERT INTO state ("id", "uf", "name") VALUES (25, 'SE', 'Sergipe');
    INSERT INTO state ("id", "uf", "name") VALUES (26, 'SP', 'São Paulo');
    INSERT INTO state ("id", "uf", "name") VALUES (27, 'TO', 'Tocantins');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM public.state`);
  }
}
