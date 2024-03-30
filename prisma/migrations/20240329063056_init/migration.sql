/*
  Warnings:

  - Made the column `salt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sessionToken` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "salt" SET NOT NULL,
ALTER COLUMN "sessionToken" SET NOT NULL;
