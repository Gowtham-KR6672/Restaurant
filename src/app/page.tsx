import Link from "next/link";

export default function Home() {
  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', width: '100%' }}>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Gourmet Scan</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          Seamless digital menu & ordering system.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login">
            <button className="btn-primary">Staff Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
