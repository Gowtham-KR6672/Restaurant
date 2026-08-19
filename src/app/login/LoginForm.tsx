'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // Fetch session to determine role and redirect accordingly
      const session = await fetch('/api/auth/session').then(r => r.json());
      const role = session?.user?.role;
      
      if (role === 'admin') router.push('/admin');
      else if (role === 'kitchen') router.push('/kitchen');
      else if (role === 'supplier') router.push('/delivery');
      else if (role === 'cashier') router.push('/cashier');
      else router.push('/');
      
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: 'red', textAlign: 'center', backgroundColor: '#ffebe9', padding: '0.5rem', borderRadius: 'var(--border-radius-sm)' }}>{error}</div>}
      
      <div>
        <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Username</label>
        <input 
          id="username"
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }}
        />
      </div>

      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
        <input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }}
        />
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
        Sign In
      </button>
    </form>
  );
}
