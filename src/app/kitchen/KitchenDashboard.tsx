'use client';

import { useEffect, useState } from 'react';
import { acceptOrder, updateOrderItemStatus } from '@/app/actions/kitchenActions';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/kitchen/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrder(orderId);
    fetchOrders();
  };

  const handleUpdateItem = async (orderId: string, itemId: string, status: string) => {
    await updateOrderItemStatus(orderId, itemId, status);
    fetchOrders();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Kitchen Dashboard</h2>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        {orders.length === 0 && <p>No pending orders.</p>}
        {orders.map(order => (
          <div key={order._id} className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Table {order.table?.number}</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>Order ID: {order.trackingId}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="status-badge" style={{
                  backgroundColor: order.status === 'Received' ? '#e2e3e5' : '#cce5ff',
                  color: '#171717',
                  fontSize: '1rem'
                }}>{order.status}</span>
                
                {order.status === 'Received' && (
                  <button onClick={() => handleAcceptOrder(order._id)} className="btn-primary">Accept Order</button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.items.map((item: any) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-sm)' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.menuItem?.name}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="status-badge" style={{ backgroundColor: item.status === 'Pending' ? '#fff3cd' : item.status === 'Preparing' ? '#cce5ff' : '#d4edda', color: '#171717' }}>{item.status}</span>
                    
                    {order.status !== 'Received' && item.status === 'Pending' && (
                      <button onClick={() => handleUpdateItem(order._id, item._id, 'Preparing')} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Start</button>
                    )}
                    {order.status !== 'Received' && item.status === 'Preparing' && (
                      <button onClick={() => handleUpdateItem(order._id, item._id, 'Prepared')} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#28a745' }}>Done</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
