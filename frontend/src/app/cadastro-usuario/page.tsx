'use client';
import { useState } from 'react';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('https://acupuntura-backend-9qd7.onrender.com/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensagem('Usuário cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
    } else {
      setMensagem(data.erro || 'Erro ao cadastrar');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleCadastro} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-6 text-center font-semibold">Cadastro de Usuário</h2>

        <input
          type="text"
          placeholder="Nome"
          className="w-full mb-4 p-2 border rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-4 p-2 border rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Cadastrar
        </button>

        {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
      </form>
    </div>
  );
}
