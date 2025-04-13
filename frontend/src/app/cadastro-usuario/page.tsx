'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [usuarios, setUsuarios] = useState([]);

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
      buscarUsuarios(); // Atualiza a lista após cadastrar
    } else {
      setMensagem(data.erro || 'Erro ao cadastrar');
    }
  };

  const buscarUsuarios = async () => {
    try {
      const res = await fetch('https://acupuntura-backend-9qd7.onrender.com/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <form onSubmit={handleCadastro} className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl mb-4 font-semibold text-center">Cadastro de Usuário</h2>

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

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Usuários Cadastrados</h3>
          {usuarios.length === 0 ? (
            <p>Nenhum usuário cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {usuarios.map((u: any) => (
                <li key={u.id} className="border-b pb-2">
                  <strong>{u.nome}</strong> – {u.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
