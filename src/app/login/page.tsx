import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Staff Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
