'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Agendamento', path: '/agendamento' },
  { label: 'Pacientes', path: '/cadastro-paciente' },
  { label: 'Consultas', path: '/historico-consultas' },
  { label: 'Pagamentos', path: '/financeiro' },
  { label: 'Sair', path: '/login' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="text-xl font-bold p-6 border-b border-gray-700">Acupuntura</div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`px-4 py-2 rounded hover:bg-gray-700 cursor-pointer ${
                pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
