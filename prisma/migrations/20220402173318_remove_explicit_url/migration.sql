/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "imageId" TEXT NOT NULL
);
INSERT INTO "new_Post" ("id", "imageId", "title") SELECT "id", "imageId", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
