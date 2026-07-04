-- DropIndex
DROP INDEX "learnset_deck_item_deckId_pokemonName_versionGroupName_key";

-- AlterTable
ALTER TABLE "learnset_deck_item"
RENAME COLUMN "pokemonName" TO "pokemonApiName";

ALTER TABLE "learnset_deck_item"
RENAME COLUMN "versionGroupName" TO "versionGroupApiName";

ALTER TABLE "learnset_deck_item"
ADD COLUMN "pokemonDisplayName" TEXT,
ADD COLUMN "versionGroupDisplayName" TEXT;

-- UpdateTable
UPDATE "learnset_deck_item"
SET "pokemonDisplayName" = "pokemonApiName",
    "versionGroupDisplayName" = "versionGroupApiName"
WHERE "pokemonDisplayName" IS NULL
   OR "versionGroupDisplayName" IS NULL;

-- AlterTable
ALTER TABLE "learnset_deck_item"
ALTER COLUMN "pokemonDisplayName" SET NOT NULL,
ALTER COLUMN "versionGroupDisplayName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "learnset_deck_item_deckId_pokemonApiName_versionGroupApiName_key"
ON "learnset_deck_item"("deckId", "pokemonApiName", "versionGroupApiName");