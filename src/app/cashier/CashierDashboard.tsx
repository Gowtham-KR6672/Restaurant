'use client';

import { useEffect, useState } from 'react';
import { markOrderPaid } from '@/app/actions/cashierActions';

export default function CashierDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/cashier/orders');
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
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePay = async (orderId: string) => {
    try {
      await markOrderPaid(orderId);
      fetchOrders();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Cashier Dashboard</h2>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        {orders.length === 0 && <p>No active orders.</p>}
        {orders.map(order => {
          const allDelivered = order.items.every((i: any) => i.status === 'Delivered');

          return (
            <div key={order._id} className="glass-card" style={{ padding: '2rem', borderLeft: allDelivered ? '4px solid #28a745' : '4px solid #ffc107' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Table {order.table?.number}</h3>
                  <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>Order ID: {order.trackingId}</p>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem' }}>Total: <span style={{ color: 'var(--primary-color)' }}>${order.totalAmount.toFixed(2)}</span></p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span className="status-badge" style={{ backgroundColor: '#e2e3e5', color: '#383d41' }}>
                      Status: {order.status}
                    </span>
                    <span className="status-badge" style={{ backgroundColor: order.paymentStatus === 'Paid' ? '#d4edda' : '#fff3cd', color: '#171717' }}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <button 
                    onClick={() => handlePay(order._id)} 
                    disabled={!allDelivered || order.paymentStatus === 'Paid'} 
                    className="btn-primary" 
                    style={{ backgroundColor: allDelivered ? '#28a745' : 'var(--text-muted)' }}
                  >
                    Mark as Paid & Complete
                  </button>
                  {!allDelivered && <small style={{ color: 'var(--text-muted)' }}>All items must be delivered first</small>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
