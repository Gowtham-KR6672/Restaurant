import { createTable, deleteTable } from '@/app/actions/tableActions';
import dbConnect from '@/lib/db';
import TableModel from '@/models/Table';
import QRCodeComponent from './QRCodeComponent';

export default async function TablesPage() {
  await dbConnect();
  const tables = await TableModel.find().sort({ number: 1 }).lean();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Tables</h2>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>Add New Table</h3>
        <form action={createTable} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Table Number</label>
            <input name="number" type="number" required min="1" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn-primary">Add Table</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {tables.map(table => (
          <div key={table._id.toString()} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Table {table.number}</h3>
              <form action={async () => {
                'use server';
                await deleteTable(table._id.toString());
              }}>
                <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
              </form>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', wordBreak: 'break-all' }}>
              Token: {table.qrToken}
            </p>
            
            <QRCodeComponent token={table.qrToken} tableNumber={table.number} />
          </div>
        ))}
        {tables.length === 0 && <p>No tables found.</p>}
      </div>
    </div>
  );
}
