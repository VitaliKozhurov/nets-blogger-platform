import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRelationToCommentLike1783499511598 implements MigrationInterface {
    name = 'AddUserRelationToCommentLike1783499511598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "user_confirmations_userId_fkey"`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "websiteUrl" text NOT NULL, "isMembership" boolean NOT NULL, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."comment_likes_status_enum" AS ENUM('None', 'Like', 'Dislike')`);
        await queryRunner.query(`CREATE TABLE "comment_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "commentId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."comment_likes_status_enum" NOT NULL, CONSTRAINT "UQ_ec6698ead14ad945033ebb2f1b9" UNIQUE ("userId", "commentId"), CONSTRAINT "PK_2c299aaf1f903c45ee7e6c7b419" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "postId" uuid NOT NULL, "content" text NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "blogId" uuid NOT NULL, "title" text NOT NULL, "shortDescription" text NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."post_likes_status_enum" AS ENUM('None', 'Like', 'Dislike')`);
        await queryRunner.query(`CREATE TABLE "post_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "postId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."post_likes_status_enum" NOT NULL, CONSTRAINT "UQ_30ee85070afe5b92b5920957b1c" UNIQUE ("userId", "postId"), CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_password_recovery_codes" ("userId" uuid NOT NULL, "code" uuid NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_27679aedc84e4a7d9c45f7f2924" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "device_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "deviceId" uuid NOT NULL, "deviceName" text NOT NULL, "ip" character varying(50) NOT NULL, "iat" bigint NOT NULL, "expirationAt" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_edd47f6f4a3c2d3ec98be8d7ed5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "user_confirmations_pkey"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "user_confirmations_pkey" PRIMARY KEY ("userId", "id")`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "user_confirmations_pkey"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "PK_1c21e3f5db0f547698a27c3f1e4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "UQ_ce9501a1d346d4a0c572e0c88fe" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ALTER COLUMN "isConfirmed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "check_email_unique"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_likes" ADD CONSTRAINT "FK_6999d13aca25e33515210abaf16" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_likes" ADD CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "FK_ce9501a1d346d4a0c572e0c88fe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_password_recovery_codes" ADD CONSTRAINT "FK_27679aedc84e4a7d9c45f7f2924" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_password_recovery_codes" DROP CONSTRAINT "FK_27679aedc84e4a7d9c45f7f2924"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "FK_ce9501a1d346d4a0c572e0c88fe"`);
        await queryRunner.query(`ALTER TABLE "post_likes" DROP CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498"`);
        await queryRunner.query(`ALTER TABLE "post_likes" DROP CONSTRAINT "FK_6999d13aca25e33515210abaf16"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "check_email_unique" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ALTER COLUMN "isConfirmed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "UQ_ce9501a1d346d4a0c572e0c88fe"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "PK_1c21e3f5db0f547698a27c3f1e4"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "user_confirmations_pkey" PRIMARY KEY ("userId", "id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP CONSTRAINT "user_confirmations_pkey"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "user_confirmations_pkey" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" DROP COLUMN "id"`);
        await queryRunner.query(`DROP TABLE "device_session"`);
        await queryRunner.query(`DROP TABLE "user_password_recovery_codes"`);
        await queryRunner.query(`DROP TABLE "post_likes"`);
        await queryRunner.query(`DROP TYPE "public"."post_likes_status_enum"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "comment_likes"`);
        await queryRunner.query(`DROP TYPE "public"."comment_likes_status_enum"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`ALTER TABLE "user_confirmations" ADD CONSTRAINT "user_confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
