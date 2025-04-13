/*
  Warnings:

  - A unique constraint covering the columns `[consultaId]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_consultaId_key" ON "Pagamento"("consultaId");
