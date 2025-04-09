const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cria paciente
  const paciente = await prisma.paciente.create({
    data: {
      nome: 'Maria da Silva',
      telefone: '11988887777',
      email: 'maria.silva@email.com',
    },
  });

  // Cria duas consultas para esse paciente
  const consulta1 = await prisma.consulta.create({
    data: {
      data: new Date('2024-04-05T13:00:00'),
      horario: '13:00',
      tipoDeAtendimento: 'Consulta',
      pacienteId: paciente.id,
    },
  });

  const consulta2 = await prisma.consulta.create({
    data: {
      data: new Date('2024-04-10T10:00:00'),
      horario: '10:00',
      tipoDeAtendimento: 'Aurículo',
      pacienteId: paciente.id,
    },
  });

  // Pagamento da primeira consulta
  await prisma.pagamento.create({
    data: {
      consultaId: consulta1.id,
      valor: 120.0,
      data: new Date(),
      formaPagamento: 'Dinheiro',
      pago: true,
    },
  });

  // Pagamento da segunda consulta
  await prisma.pagamento.create({
    data: {
      consultaId: consulta2.id,
      valor: 150.0,
      data: new Date(),
      formaPagamento: 'Cartão',
      pago: true,
    },
  });

  console.log('Dados de teste inseridos com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
