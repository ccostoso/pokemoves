/*
  Warnings:

  - Added the required column `pokemonId` to the `learnset_deck_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "learnset_deck_item" ADD COLUMN     "pokemonId" INTEGER NOT NULL;
