-- CreateEnum
CREATE TYPE "TaskDraftBatchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "task_draft_batches" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" "TaskDraftBatchStatus" NOT NULL DEFAULT 'PENDING',
    "projectId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "task_draft_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_draft_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "batchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_draft_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_draft_batches_projectId_idx" ON "task_draft_batches"("projectId");

-- CreateIndex
CREATE INDEX "task_draft_batches_creatorId_idx" ON "task_draft_batches"("creatorId");

-- CreateIndex
CREATE INDEX "task_draft_batches_deletedAt_idx" ON "task_draft_batches"("deletedAt");

-- CreateIndex
CREATE INDEX "task_draft_items_batchId_idx" ON "task_draft_items"("batchId");

-- AddForeignKey
ALTER TABLE "task_draft_batches" ADD CONSTRAINT "task_draft_batches_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_draft_batches" ADD CONSTRAINT "task_draft_batches_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_draft_items" ADD CONSTRAINT "task_draft_items_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "task_draft_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
