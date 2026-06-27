-- CreateTable
CREATE TABLE "learnset_deck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learnset_deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learnset_deck_item" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "pokemonName" TEXT NOT NULL,
    "versionGroupName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learnset_deck_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "learnset_deck_userId_idx" ON "learnset_deck"("userId");

-- CreateIndex
CREATE INDEX "learnset_deck_item_deckId_idx" ON "learnset_deck_item"("deckId");

-- CreateIndex
CREATE UNIQUE INDEX "learnset_deck_item_deckId_pokemonName_versionGroupName_key" ON "learnset_deck_item"("deckId", "pokemonName", "versionGroupName");

-- AddForeignKey
ALTER TABLE "learnset_deck" ADD CONSTRAINT "learnset_deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learnset_deck_item" ADD CONSTRAINT "learnset_deck_item_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "learnset_deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
