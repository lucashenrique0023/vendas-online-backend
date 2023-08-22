import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCategory1692716546453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            create table public.category (
                id integer NOT NULL,
                name character varying NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone default now() NOT NULL,
                primary key (id)
            );
            
            CREATE SEQUENCE public.category_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;
            ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE public.category;`);
  }
}
