-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_memberId_fkey";

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
