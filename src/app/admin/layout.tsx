'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Menu', path: '/admin/menu' },
    { name: 'Tables & QR', path: '/admin/tables' },
    { name: 'Staff', path: '/admin/users' },
  ];

  const SidebarContent = () => (
    <>
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '2rem', textAlign: 'center' }}>Admin Panel</h2>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)} style={{
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
        style={{ backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', marginTop: 'auto' }}
      >
        Logout
      </button>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ backgroundColor: 'var(--card-bg)', borderRight: 'var(--glass-border)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: '250px', backgroundColor: 'var(--card-bg)', borderRight: 'var(--glass-border)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Mobile Header */}
        <header className="mobile-header-bar">
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
            ☰
          </button>
          <h3 style={{ margin: 0, marginLeft: '1rem', color: 'var(--primary-color)' }}>Gourmet Scan</h3>
        </header>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div className="container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
