import { createUser, deleteUser } from '@/app/actions/userActions';
import dbConnect from '@/lib/db';
import UserModel from '@/models/User';

export default async function UsersPage() {
  await dbConnect();
  const users = await UserModel.find().sort({ role: 1 }).lean();

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Manage Staff</h2>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>Add Staff Member</h3>
        <form action={createUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
            <input name="name" type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Username</label>
            <input name="username" type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input name="password" type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Role</label>
            <select name="role" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }}>
              <option value="kitchen">Kitchen Team</option>
              <option value="supplier">Supplier / Delivery</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Add Staff</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {users.map(user => (
          <div key={user._id.toString()} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{user.name}</h3>
              {user.username !== 'admin' && (
                <form action={async () => {
                  'use server';
                  await deleteUser(user._id.toString());
                }}>
                  <button type="submit" style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                </form>
              )}
            </div>
            
            <p style={{ margin: '0.5rem 0' }}><strong>Username:</strong> {user.username}</p>
            <p style={{ margin: 0 }}>
              <span className="status-badge" style={{ backgroundColor: '#cce5ff', color: '#004085', textTransform: 'capitalize' }}>{user.role}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
