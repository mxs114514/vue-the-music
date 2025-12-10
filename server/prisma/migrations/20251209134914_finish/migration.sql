/*
  Warnings:

  - Added the required column `updatedAt` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "songId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "PlayRecord_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PlayRecord" ("id", "playedAt", "songId") SELECT "id", "playedAt", "songId" FROM "PlayRecord";
DROP TABLE "PlayRecord";
ALTER TABLE "new_PlayRecord" RENAME TO "PlayRecord";
CREATE INDEX "PlayRecord_playedAt_idx" ON "PlayRecord"("playedAt");
CREATE INDEX "PlayRecord_songId_idx" ON "PlayRecord"("songId");
CREATE INDEX "PlayRecord_userId_idx" ON "PlayRecord"("userId");
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT,
    "url" TEXT NOT NULL,
    "cover" TEXT,
    "lrcUrl" TEXT,
    "duration" INTEGER,
    "size" INTEGER NOT NULL DEFAULT 0,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Song" ("artist", "cover", "createdAt", "id", "lrcUrl", "title", "url") SELECT "artist", "cover", "createdAt", "id", "lrcUrl", "title", "url" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE INDEX "Song_title_idx" ON "Song"("title");
CREATE INDEX "Song_artist_idx" ON "Song"("artist");
CREATE INDEX "Song_createdAt_idx" ON "Song"("createdAt");
CREATE INDEX "Song_playCount_idx" ON "Song"("playCount");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("id", "password", "role", "username") SELECT "id", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
