/*
  Warnings:

  - You are about to drop the column `imgTweet` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_authorId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imgTweet";

-- CreateTable
CREATE TABLE "TweetImg" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "TweetImg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TweetImg_postId_key" ON "TweetImg"("postId");

-- AddForeignKey
ALTER TABLE "TweetImg" ADD CONSTRAINT "TweetImg_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
