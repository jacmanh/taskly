/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedToId_fkey";

-- DropIndex
DROP INDEX "tasks_archivedAt_idx";

-- DropIndex
DROP INDEX "tasks_assignedToId_idx";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "archivedAt",
DROP COLUMN "assignedToId",
ADD COLUMN     "assignedId" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "tasks_assignedId_idx" ON "tasks"("assignedId");

-- CreateIndex
CREATE INDEX "tasks_deletedAt_idx" ON "tasks"("deletedAt");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
