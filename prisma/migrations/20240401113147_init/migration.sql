-- DropForeignKey
ALTER TABLE "TweetImg" DROP CONSTRAINT "TweetImg_postId_fkey";

-- AddForeignKey
ALTER TABLE "TweetImg" ADD CONSTRAINT "TweetImg_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
