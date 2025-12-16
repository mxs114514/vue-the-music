-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "updatedAt" DATETIME NOT NULL,
    "uploaderId" INTEGER,
    CONSTRAINT "Song_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album", "artist", "cover", "createdAt", "duration", "id", "isDeleted", "lrcUrl", "playCount", "size", "title", "updatedAt", "url") SELECT "album", "artist", "cover", "createdAt", "duration", "id", "isDeleted", "lrcUrl", "playCount", "size", "title", "updatedAt", "url" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE INDEX "Song_title_idx" ON "Song"("title");
CREATE INDEX "Song_artist_idx" ON "Song"("artist");
CREATE INDEX "Song_createdAt_idx" ON "Song"("createdAt");
CREATE INDEX "Song_playCount_idx" ON "Song"("playCount");
CREATE INDEX "Song_album_idx" ON "Song"("album");
CREATE INDEX "Song_uploaderId_idx" ON "Song"("uploaderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
