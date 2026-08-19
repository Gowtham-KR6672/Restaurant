import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import User from '@/models/User';
import Table from '@/models/Table';

export const revalidate = 0; // Ensure data is fresh

export default async function AdminOverviewPage() {
  await dbConnect();
  
  const [
    totalOrders,
    totalMenuItems,
    totalStaff,
    totalTables,
    recentOrders
  ] = await Promise.all([
    Order.countDocuments(),
    MenuItem.countDocuments(),
    User.countDocuments(),
    Table.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate({ path: 'table', model: Table }).lean()
  ]);

  // Calculate total revenue from all completed orders
  const revenueResult = await Order.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Revenue</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${totalRevenue.toFixed(2)}</span>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Orders</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalOrders}</span>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Menu Items</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalMenuItems}</span>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Tables</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalTables}</span>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Staff Members</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalStaff}</span>
        </div>
      </div>
      
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Orders</h3>
        {recentOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Tracking ID</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Table</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Amount</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order._id.toString()} style={{ borderBottom: '1px solid #eaeaea' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{order.trackingId}</td>
                    <td style={{ padding: '0.75rem' }}>{order.table?.number || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="status-badge" style={{ backgroundColor: order.status === 'Completed' ? '#d4edda' : '#fff3cd', color: order.status === 'Completed' ? '#155724' : '#856404' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="status-badge" style={{ backgroundColor: order.paymentStatus === 'Paid' ? '#cce5ff' : '#f8d7da', color: order.paymentStatus === 'Paid' ? '#004085' : '#721c24' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No orders have been placed yet.</p>
        )}
      </div>
    </div>
  );
}
