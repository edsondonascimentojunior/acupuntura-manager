-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pagamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "consultaId" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "formaPagamento" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pagamento_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pagamento" ("consultaId", "data", "formaPagamento", "id", "pago", "valor") SELECT "consultaId", "data", "formaPagamento", "id", "pago", "valor" FROM "Pagamento";
DROP TABLE "Pagamento";
ALTER TABLE "new_Pagamento" RENAME TO "Pagamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
