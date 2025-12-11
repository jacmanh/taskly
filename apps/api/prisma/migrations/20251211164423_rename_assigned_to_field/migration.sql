/*
  Warnings:

  - You are about to drop the column `assignedId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedId_fkey";

-- DropIndex
DROP INDEX "tasks_assignedId_idx";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assignedId",
ADD COLUMN     "assignedToId" TEXT;

-- CreateIndex
CREATE INDEX "tasks_assignedToId_idx" ON "tasks"("assignedToId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
