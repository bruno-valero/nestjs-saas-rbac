/*
  Warnings:

  - The values [ANONYMOUS] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `OrganizationId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,organization_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organization_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('ADMIN', 'MEMBER', 'BILLING');
ALTER TABLE "roles" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TABLE "invites" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "Roles_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_OrganizationId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_userId_fkey";

-- DropIndex
DROP INDEX "members_user_id_OrganizationId_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "OrganizationId",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_organization_id_key" ON "members"("user_id", "organization_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
