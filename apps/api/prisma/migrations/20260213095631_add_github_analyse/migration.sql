-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "aiGeneratedContext" TEXT,
ADD COLUMN     "githubOwner" TEXT,
ADD COLUMN     "githubRepoName" TEXT,
ADD COLUMN     "githubRepoUrl" TEXT;
