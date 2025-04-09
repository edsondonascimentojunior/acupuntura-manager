'use client';

import { useState, useEffect } from 'react';

export default function CadastroPaciente() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://https://acupuntura-manager.onrender.com/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone, email })
    });

    if (res.ok) {
      setMensagem('Paciente cadastrado com sucesso!');
      setNome('');
      setTelefone('');
      setEmail('');
    } else {
      setMensagem('Erro ao cadastrar paciente.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Cadastro de Paciente</h2>

        <label className="block mb-2">Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2">Telefone:</label>
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2">Email (opcional):</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Cadastrar
        </button>

        {mensagem && <p className="text-center mt-4">{mensagem}</p>}
      </form>
    </div>
  );
}
