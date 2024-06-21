-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "timer" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'В процессе',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
