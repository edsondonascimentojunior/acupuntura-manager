'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, History, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';

// ✅ Interface para corrigir a tipagem de consultas
interface ConsultaSemana {
  id: number;
  dataHora: string;
  servico?: string;
  paciente: {
    nome: string;
  };
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState('');
  const [consultas, setConsultas] = useState<ConsultaSemana[]>([]);
  const router = useRouter();

  useEffect(() => {
    const nome = localStorage.getItem('usuarioNome');
    if (!nome) {
      router.push('/login');
    } else {
      setUsuario(nome);
    }

    // Buscar consultas da semana
    fetch('https://acupuntura-manager.onrender.com/consultas/semana')
      .then((res) => res.json())
      .then((data) => setConsultas(data))
      .catch((err) => console.error('Erro ao buscar consultas:', err));
  }, [router]);

  const opcoes = [
    {
      nome: 'Agendar Consulta',
      icone: <CalendarDays className="w-8 h-8 mb-2" />,
      link: '/agendamento',
    },
    {
      nome: 'Histórico de Consultas',
      icone: <History className="w-8 h-8 mb-2" />,
      link: '/historico-consultas',
    },
    {
      nome: 'Pagamentos e Financeiro',
      icone: <CreditCard className="w-8 h-8 mb-2" />,
      link: '/financeiro',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Bem-vindo, {usuario}!</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {opcoes.map((opcao) => (
            <Link
              href={opcao.link}
              key={opcao.nome}
              className="flex flex-col items-center justify-center bg-white shadow-md p-6 rounded-2xl hover:shadow-lg transition"
            >
              {opcao.icone}
              <span className="text-lg font-semibold text-center">{opcao.nome}</span>
            </Link>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Consultas desta Semana</h2>
          <div className="bg-white shadow-md rounded-2xl overflow-hidden">
            {consultas.length === 0 ? (
              <p className="p-4 text-gray-500">Nenhuma consulta agendada para esta semana.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-4">Paciente</th>
                    <th className="p-4">Horário</th>
                    <th className="p-4">Serviço</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map((consulta) => (
                    <tr key={consulta.id} className="border-t">
                      <td className="p-4">{consulta.paciente.nome}</td>
                      <td className="p-4">{new Date(consulta.dataHora).toLocaleString('pt-BR')}</td>
                      <td className="p-4">{consulta.servico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
