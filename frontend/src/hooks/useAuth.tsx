'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const nomeUsuario = localStorage.getItem('usuarioNome');

    // Só redireciona se não estiver na página de login
    if (!nomeUsuario && typeof window !== 'undefined' && window.location.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);
}
