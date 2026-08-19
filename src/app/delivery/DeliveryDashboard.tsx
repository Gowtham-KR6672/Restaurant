'use client';

import { useEffect, useState } from 'react';
import { markItemDelivered } from '@/app/actions/deliveryActions';

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/delivery/orders');
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

  const handleDeliver = async (orderId: string, itemId: string) => {
    await markItemDelivered(orderId, itemId);
    fetchOrders();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Delivery Dashboard</h2>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        {orders.length === 0 && <p>No prepared items waiting for delivery.</p>}
        {orders.map(order => {
          const preparedItems = order.items.filter((i: any) => i.status === 'Prepared');
          if (preparedItems.length === 0) return null;

          return (
            <div key={order._id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Table {order.table?.number}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>Order ID: {order.trackingId}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {preparedItems.map((item: any) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-sm)' }}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.menuItem?.name}
                    </div>
                    
                    <button onClick={() => handleDeliver(order._id, item._id)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#28a745' }}>
                      Mark Delivered
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
