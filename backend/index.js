require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { startOfWeek, endOfWeek } = require("date-fns");


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Lista todos os pacientes
app.get("/api/pacientes", async (req, res) => {
  const pacientes = await prisma.paciente.findMany();
  res.json(pacientes);
});

// Cria um paciente
app.post("/api/pacientes", async (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({ erro: "Nome e telefone são obrigatórios." });
  }

  try {
    const novoPaciente = await prisma.paciente.create({
      data: { nome, telefone, email }
    });
    res.status(201).json(novoPaciente);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar paciente' });
  }
});

// Agendamento de consulta
app.post("/api/agendamentos", async (req, res) => {
  const { pacienteId, data, horario, tipoDeAtendimento } = req.body;

  if (!pacienteId || !data || !horario || !tipoDeAtendimento) {
    return res.status(400).json({ erro: "Dados incompletos para agendamento." });
  }

  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        data: new Date(data),
        horario,
        tipoDeAtendimento,
        pacienteId: parseInt(pacienteId),
      },
    });

    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error("Erro ao agendar consulta:", error);
    res.status(500).json({ erro: "Erro ao agendar consulta" });
  }
});

// Criar nova consulta com registro de atendimento
app.post("/api/consultas", async (req, res) => {
  const { pacienteId, data, horario, tipoDeAtendimento, registroAtendimento } = req.body;

  if (!pacienteId || !data || !horario || !tipoDeAtendimento) {
    return res.status(400).json({ erro: "Dados incompletos para a consulta." });
  }

  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        data: new Date(data),
        horario,
        tipoDeAtendimento,
        pacienteId: parseInt(pacienteId),
        registroAtendimento: registroAtendimento || "",
      },
    });

    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error("Erro ao registrar nova consulta:", error);
    res.status(500).json({ erro: "Erro ao registrar nova consulta" });
  }
});

// Lista todas as consultas com paciente
app.get("/api/consultas", async (req, res) => {
  try {
    const consultas = await prisma.consulta.findMany({
      include: {
        paciente: true
      },
      orderBy: {
        data: 'desc'
      }
    });

    res.json(consultas);
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    res.status(500).json({ erro: "Erro ao buscar consultas" });
  }
});

app.get('/api/consultas/semana', async (req, res) => {
  try {
    const hoje = new Date();
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }); // segunda-feira
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 });      // domingo

    const consultasSemana = await prisma.consulta.findMany({
      where: {
        data: {
          gte: inicioSemana,
          lte: fimSemana
        }
      },
      include: {
        paciente: {
          select: { nome: true }
        }
      },
      orderBy: {
        data: 'asc'
      }
    });

    res.json(consultasSemana);
  } catch (error) {
    console.error('Erro ao buscar consultas da semana:', error);
    res.status(500).json({ erro: 'Erro ao buscar consultas da semana' });
  }
});

// Buscar histórico de um paciente (corrigido)
app.get("/api/pacientes/:id/historico", async (req, res) => {
  const pacienteId = parseInt(req.params.id);

  try {
    const historico = await prisma.consulta.findMany({
      where: { pacienteId },
      orderBy: { data: "desc" },
      include: {
        paciente: true,
        pagamentos: true // ✅ Correto: plural e compatível com o model
      }
    });

    res.json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ erro: "Erro ao buscar histórico" });
  }
});

// Atualizar registro de atendimento
app.put("/api/consultas/:id/registro", async (req, res) => {
  const consultaId = parseInt(req.params.id);
  const { registroAtendimento } = req.body;

  try {
    const consultaAtualizada = await prisma.consulta.update({
      where: { id: consultaId },
      data: { registroAtendimento }
    });

    res.json(consultaAtualizada);
  } catch (error) {
    console.error("Erro ao salvar atendimento:", error);
    res.status(500).json({ erro: "Erro ao salvar atendimento" });
  }
});

// Criar pagamento
app.post("/api/pagamentos", async (req, res) => {
  const { consultaId, valor, formaPagamento, pago } = req.body;

  if (!consultaId || !valor || !formaPagamento) {
    return res.status(400).json({ erro: "Dados incompletos para o pagamento." });
  }

  try {
    const novoPagamento = await prisma.pagamento.create({
      data: {
        consultaId: parseInt(consultaId),
        valor: parseFloat(valor),
        formaPagamento,
        pago: pago || false,
      },
    });

    res.status(201).json(novoPagamento);
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error);
    res.status(500).json({ erro: "Erro ao registrar pagamento" });
  }
});

// Listar pagamentos com dados de consulta e paciente
app.get("/api/pagamentos", async (req, res) => {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      include: {
        consulta: {
          include: {
            paciente: true
          }
        }
      },
      orderBy: {
        data: "desc"
      }
    });

    res.json(pagamentos);
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    res.status(500).json({ erro: "Erro ao buscar pagamentos" });
  }
});

// Atualiza o pagamento como "pago" e registra a forma de pagamento
app.put("/api/pagamentos/:id/pagar", async (req, res) => {
  const id = parseInt(req.params.id);
  const { formaPagamento } = req.body;

  if (!formaPagamento) {
    return res.status(400).json({ erro: "Forma de pagamento é obrigatória." });
  }

  try {
    const pagamento = await prisma.pagamento.update({
      where: { id },
      data: {
        pago: true,
        formaPagamento,
      },
      include: {
        consulta: {
          include: {
            paciente: true
          }
        }
      }
    });

    res.json(pagamento);
  } catch (error) {
    console.error("Erro ao marcar como pago:", error);
    res.status(500).json({ erro: "Erro ao atualizar pagamento" });
  }
});

// ✅ Corrigida: pagar consulta com verificação e criação/atualização de pagamento
app.patch('/api/consultas/:id/pagar', async (req, res) => {
  const consultaId = parseInt(req.params.id);
  const { formaPagamento, valor } = req.body;

  if (!formaPagamento || !valor) {
    return res.status(400).json({ error: 'Forma de pagamento e valor são obrigatórios.' });
  }

  try {
    const pagamentoExistente = await prisma.pagamento.findUnique({
      where: { consultaId },
    });

    let pagamento;
    if (pagamentoExistente) {
      pagamento = await prisma.pagamento.update({
        where: { consultaId },
        data: {
          pago: true,
          formaPagamento,
          valor: parseFloat(valor),
        },
      });
    } else {
      pagamento = await prisma.pagamento.create({
        data: {
          consultaId,
          valor: parseFloat(valor),
          formaPagamento,
          pago: true,
        },
      });
    }

    res.json(pagamento);
  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    res.status(500).json({ error: 'Erro ao registrar pagamento.' });
  }
});

// Cadastro de usuário
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada
      }
    });

    res.status(201).json({ mensagem: "Usuário criado com sucesso", usuario: { id: novoUsuario.id, nome: novoUsuario.nome } });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// Listar todos os usuários
app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
      orderBy: { id: "asc" }
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

// Login de usuário
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    res.json({ mensagem: "Login realizado com sucesso", usuario: { id: usuario.id, nome: usuario.nome } });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

// Inicializa o servidor
app.listen(3001, () => {
  console.log("Servidor backend rodando em https://acupuntura-backend-9qd7.onrender.com");
});
