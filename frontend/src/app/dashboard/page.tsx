'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, History, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [usuario, setUsuario] = useState('');
  const router = useRouter();

  useEffect(() => {
  const nome = localStorage.getItem('usuarioNome');
  if (!nome) {
    router.push('/login');
  } else {
    setUsuario(nome);
  }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Bem-vindo, {usuario}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
    </div>
  );
}
