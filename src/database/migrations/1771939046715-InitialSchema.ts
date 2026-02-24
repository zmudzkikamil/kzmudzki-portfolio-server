import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1771939046715 implements MigrationInterface {
    name = 'InitialSchema1771939046715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "position" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "period" character varying NOT NULL, "description" character varying NOT NULL, "skills" text NOT NULL, "experienceId" integer, CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience" ("id" SERIAL NOT NULL, "company" character varying NOT NULL, "period" character varying NOT NULL, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "knowledge" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, "level" character varying NOT NULL, "skills" text NOT NULL, CONSTRAINT "PK_4159ba98b65a20a8d1f257bc514" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "about_me" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "icon" character varying NOT NULL, CONSTRAINT "PK_0d62a8759f7eca42ffce765dedb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image" character varying NOT NULL, "projectId" character varying, CONSTRAINT "PK_86cfb9e426c77d60b900fe2b543" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "improvement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "improvement" character varying NOT NULL, "description" character varying, "descriptionDetails" text, "projectId" character varying, CONSTRAINT "PK_e66673bbd7dcbddb0bb705d193f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" character varying NOT NULL, "category" character varying NOT NULL, "title" character varying NOT NULL, "image" character varying NOT NULL, "skills" text NOT NULL, "details" text, "technologies" text, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cert" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "dateIssued" TIMESTAMP WITH TIME ZONE NOT NULL, "icon" character varying NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6a0ce80cc860598b4f16c00998c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "message" text NOT NULL, "ip_address" character varying NOT NULL, "submitted_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_5b7b44e69fd5866a5769aeeb9d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "position" ADD CONSTRAINT "FK_fddf259f55f3d63af37b02e5871" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_8f983d46598fc9a581e69882585" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "improvement" ADD CONSTRAINT "FK_0c4e6f7ca630500c8936e338028" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "improvement" DROP CONSTRAINT "FK_0c4e6f7ca630500c8936e338028"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_8f983d46598fc9a581e69882585"`);
        await queryRunner.query(`ALTER TABLE "position" DROP CONSTRAINT "FK_fddf259f55f3d63af37b02e5871"`);
        await queryRunner.query(`DROP TABLE "contact_submissions"`);
        await queryRunner.query(`DROP TABLE "cert"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "improvement"`);
        await queryRunner.query(`DROP TABLE "view"`);
        await queryRunner.query(`DROP TABLE "about_me"`);
        await queryRunner.query(`DROP TABLE "knowledge"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TABLE "position"`);
    }

}
