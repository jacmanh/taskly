-- CreateEnum
CREATE TYPE "DeleteStrategy" AS ENUM ('SOFT', 'HARD');

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "deleteStrategy" "DeleteStrategy" NOT NULL DEFAULT 'SOFT';
