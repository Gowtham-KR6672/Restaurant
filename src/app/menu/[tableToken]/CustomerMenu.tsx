'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type MenuItem = { _id: string, name: string, description: string, price: number, imageUrl?: string, category: string };
type Category = { _id: string, name: string };
type CartItem = MenuItem & { quantity: number };

export default function CustomerMenu({ tableId, tableNumber, categories, menuItems }: {
  tableId: string; tableNumber: number; categories: Category[]; menuItems: MenuItem[]
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i._id === id) {
        return { ...i, quantity: Math.max(0, i.quantity + delta) };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          items: cart.map(c => ({ menuItemId: c._id, quantity: c.quantity }))
        })
      });
      
      const data = await res.json();
      if (res.ok && data.trackingId) {
        router.push(`/track/${data.trackingId}`);
      } else {
        alert('Failed to place order: ' + data.error);
        setIsSubmitting(false);
      }
    } catch (e) {
      alert('Network error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>Table {tableNumber} Menu</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select items to order</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {categories.map(category => {
          const itemsInCategory = menuItems.filter(m => m.category === category._id);
          if (itemsInCategory.length === 0) return null;
          
          return (
            <div key={category._id} style={{ gridColumn: '1 / -1' }}>
              <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {category.name}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {itemsInCategory.map(item => (
                  <div key={item._id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem' }} />
                    )}
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{item.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>{item.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)' }}>${item.price.toFixed(2)}</span>
                      <button onClick={() => addToCart(item)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10 }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '2px solid var(--primary-color)' }}>
            <h3 style={{ margin: 0 }}>Your Order</h3>
            <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>(${item.price.toFixed(2)})</span></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item._id, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--text-muted)', background: 'transparent', cursor: 'pointer' }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--text-muted)', background: 'transparent', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total: ${totalAmount.toFixed(2)}</span>
              <button onClick={placeOrder} disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
