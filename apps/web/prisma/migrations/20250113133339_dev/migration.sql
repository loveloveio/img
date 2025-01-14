/*
  Warnings:

  - Added the required column `icon` to the `search_engines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "search_engines" ADD COLUMN     "icon" TEXT NOT NULL;
