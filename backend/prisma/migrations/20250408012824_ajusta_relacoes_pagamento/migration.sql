/*
  Warnings:

  - You are about to drop the column `dataDoPagamento` on the `Pagamento` table. All the data in the column will be lost.
  - Added the required column `formaPagamento` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pagamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "consultaId" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formaPagamento" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Pagamento_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pagamento" ("consultaId", "id", "valor") SELECT "consultaId", "id", "valor" FROM "Pagamento";
DROP TABLE "Pagamento";
ALTER TABLE "new_Pagamento" RENAME TO "Pagamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
