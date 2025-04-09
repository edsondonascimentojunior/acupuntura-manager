'use client';
import { useEffect, useState } from 'react';

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const fetchPagamentos = async () => {
    const res = await fetch('http://localhost:3001/api/pagamentos');
    const data = await res.json();
    setPagamentos(data);
  };

  const marcarComoPago = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/pagamentos/${id}/pagar`, {
      method: 'PUT'
    });

    if (res.ok) {
      fetchPagamentos(); // atualiza a lista
    }
  };

  const pagamentosFiltrados = pagamentos.filter((pgto: any) => {
    const nome = pgto.consulta?.paciente?.nome?.toLowerCase() || '';
    const data = pgto.consulta?.data
      ? new Date(pgto.consulta.data).toLocaleDateString('pt-BR')
      : '';

    return (
      nome.includes(filtro.toLowerCase()) ||
      data.includes(filtro)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pagamentos e Financeiro</h1>

      <input
        type="text"
        placeholder="Filtrar por paciente ou data (dd/mm/aaaa)"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Paciente</th>
            <th className="p-3">Valor</th>
            <th className="p-3">Data</th>
            <th className="p-3">Forma de Pagamento</th>
            <th className="p-3">Pago</th>
            <th className="p-3">Ação</th>
          </tr>
        </thead>
        <tbody>
          {pagamentosFiltrados.map((pgto: any) => (
            <tr key={pgto.id} className="border-t">
              <td className="p-3">{pgto.consulta?.paciente?.nome}</td>
              <td className="p-3">R$ {pgto.valor.toFixed(2)}</td>
              <td className="p-3">
                {pgto.consulta?.data
                  ? new Date(pgto.consulta.data).toLocaleDateString()
                  : '---'}
              </td>
              <td className="p-3">{pgto.formaPagamento}</td>
              <td className="p-3">{pgto.pago ? 'Sim' : 'Não'}</td>
              <td className="p-3">
                {!pgto.pago && (
                  <button
                    onClick={() => marcarComoPago(pgto.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Marcar como pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
