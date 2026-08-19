'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Delivery Dashboard', path: '/delivery' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <aside style={{ width: '250px', backgroundColor: 'var(--card-bg)', borderRight: 'var(--glass-border)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '2rem', textAlign: 'center' }}>Delivery</h2>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-color)',
                textDecoration: 'none',
                fontWeight: isActive ? '600' : '400',
                transition: 'all var(--transition-fast)'
              }}>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })} 
          className="btn-primary" 
          style={{ backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}
        >
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
