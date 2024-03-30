-- DropIndex
DROP INDEX "Post_authorId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL;
