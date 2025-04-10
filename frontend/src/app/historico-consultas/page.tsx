'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Paciente {
  id: number;
  nome: string;
}

interface Consulta {
  id: number;
  data: string;
  horario: string;
  tipoDeAtendimento: string;
  registroAtendimento?: string;
}

export default function HistoricoConsultasPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [novoRegistro, setNovoRegistro] = useState<string>('');

  useEffect(() => {
    axios.get('https://acupuntura-backend-9qd7.onrender.com/api/pacientes')
      .then(res => setPacientes(res.data))
      .catch(() => setErro('Erro ao buscar pacientes.'));
  }, []);

  const buscarHistorico = async () => {
    if (!pacienteSelecionado) return;
    setErro(null);
    setMensagem(null);
    try {
      const res = await axios.get(`https://acupuntura-backend-9qd7.onrender.com/api/pacientes/${pacienteSelecionado}/historico`);
      setConsultas(res.data);
    } catch {
      setErro('Erro ao buscar histórico do paciente.');
    }
  };

  const salvarRegistro = async (consultaId: number, texto: string) => {
    try {
      await axios.put(`https://acupuntura-backend-9qd7.onrender.com/api/consultas/${consultaId}/registro`, {
        registroAtendimento: texto,
      });
      setMensagem('Registro salvo com sucesso!');
    } catch {
      setErro('Erro ao salvar atendimento.');
    }
  };

  const registrarNovaConsulta = async () => {
    if (!pacienteSelecionado || !novoRegistro.trim()) return;
    try {
      const novaConsulta = {
        data: new Date().toISOString(),
        horario: '09:00',
        tipoDeAtendimento: 'Consulta',
        pacienteId: pacienteSelecionado,
        registroAtendimento: novoRegistro
      };
      await axios.post(`https://acupuntura-backend-9qd7.onrender.com/api/consultas`, novaConsulta);
      setMensagem('Nova consulta registrada com sucesso!');
      setNovoRegistro('');
      buscarHistorico(); // Atualiza lista
    } catch {
      setErro('Erro ao registrar nova consulta.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Histórico de Consultas</h1>

      <select
        className="border p-2 mb-4 w-full"
        value={pacienteSelecionado ?? ''}
        onChange={(e) => setPacienteSelecionado(parseInt(e.target.value))}
      >
        <option value="">Selecione um paciente</option>
        {pacientes.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={buscarHistorico}
      >
        Buscar Histórico
      </button>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}
      {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}

      {pacienteSelecionado && (
        <div className="border p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Registrar novo atendimento</h2>
          <textarea
            className="w-full border p-2"
            value={novoRegistro}
            placeholder="Descreva o atendimento atual..."
            onChange={(e) => setNovoRegistro(e.target.value)}
          />
          <button
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            onClick={registrarNovaConsulta}
          >
            Salvar nova consulta
          </button>
        </div>
      )}

      {consultas.length > 0 ? (
        <div className="space-y-4">
          {consultas.map((c) => (
            <div key={c.id} className="border p-4 rounded shadow">
              <p><strong>Data:</strong> {new Date(c.data).toLocaleDateString()}</p>
              <p><strong>Horário:</strong> {c.horario}</p>
              <p><strong>Tipo:</strong> {c.tipoDeAtendimento}</p>
              <textarea
                className="w-full border p-2 mt-2"
                defaultValue={c.registroAtendimento || ''}
                placeholder="Escreva o atendimento aqui..."
                onBlur={(e) => salvarRegistro(c.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : (
        pacienteSelecionado && <p>Este paciente ainda não possui histórico de atendimentos.</p>
      )}
    </div>
  );
}
