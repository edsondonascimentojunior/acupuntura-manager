-- CreateTable
CREATE TABLE "Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "horario" TEXT NOT NULL,
    "tipoDeAtendimento" TEXT NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    CONSTRAINT "Consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" REAL NOT NULL,
    "dataDoPagamento" DATETIME NOT NULL,
    "consultaId" INTEGER NOT NULL,
    CONSTRAINT "Pagamento_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
