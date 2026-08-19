'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

export default function TrackingClient({ trackingId }: { trackingId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${trackingId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        if (res.status === 404) setError('Order not found or has been removed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 3 seconds for real-time updates
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [trackingId]);

  const downloadInvoice = () => {
    if (!order) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('Gourmet Scan', 20, 20);
    
    doc.setFontSize(16);
    doc.text('Invoice / Receipt', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.trackingId}`, 20, 45);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 52);
    doc.text(`Status: Paid`, 20, 59);

    let yPos = 75;
    doc.setFontSize(14);
    doc.text('Items Ordered:', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    order.items.forEach((item: any) => {
      const name = item.menuItem?.name || 'Unknown';
      const qty = item.quantity;
      const price = item.menuItem?.price || 0;
      doc.text(`${qty}x ${name}`, 20, yPos);
      doc.text(`$${(price * qty).toFixed(2)}`, 170, yPos);
      yPos += 8;
    });

    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.text('Total Amount:', 20, yPos);
    doc.text(`$${order.totalAmount.toFixed(2)}`, 170, yPos);

    doc.save(`Invoice_${order.trackingId}.pdf`);
  };

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>{error}</h2>
      </div>
    );
  }

  if (!order) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading tracking information...</div>;
  }

  const isCompleted = order.status === 'Completed';

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>{isCompleted ? 'Order Completed' : 'Order Tracking'}</h1>
        <p style={{ fontSize: '1.2rem' }}>ID: <strong>{trackingId}</strong></p>
      </header>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Status:</h2>
          <span className="status-badge" style={{ fontSize: '1.2rem', padding: '0.5rem 1rem', 
            backgroundColor: order.status === 'Received' ? '#e2e3e5' : 
                             order.status === 'Preparing' ? '#cce5ff' :
                             order.status === 'Prepared' ? '#fff3cd' :
                             '#d4edda',
            color: '#171717'
          }}>
            {order.status}
          </span>
        </div>

        {isCompleted && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Thank you for dining with us!</h3>
            <p style={{ margin: 0 }}>Your order has been fully delivered and paid.</p>
            <button onClick={downloadInvoice} className="btn-primary" style={{ marginTop: '1rem', backgroundColor: '#28a745' }}>
              Download PDF Invoice
            </button>
          </div>
        )}

        <h3>Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {order.items.map((item: any) => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-sm)' }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.menuItem?.name || 'Unknown Item'}
              </div>
              <span className="status-badge" style={{
                backgroundColor: item.status === 'Pending' ? '#fff3cd' : 
                                 item.status === 'Preparing' ? '#cce5ff' :
                                 item.status === 'Prepared' ? '#d4edda' :
                                 '#e2e3e5',
                color: '#171717'
              }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', borderTop: '2px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
