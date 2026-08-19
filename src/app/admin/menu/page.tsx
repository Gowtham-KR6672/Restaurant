import { createCategory, deleteCategory, createMenuItem, deleteMenuItem } from '@/app/actions/menuActions';
import dbConnect from '@/lib/db';
import CategoryModel from '@/models/Category';
import MenuItemModel from '@/models/MenuItem';

export default async function MenuPage() {
  await dbConnect();
  const categories = await CategoryModel.find().sort({ order: 1 }).lean();
  const menuItems = await MenuItemModel.find().populate('category').lean();

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Manage Menu</h2>
      
      <div className="admin-menu-grid">
        {/* Categories Section */}
        <div>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3>Add Category</h3>
            <form action={createCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                <input name="name" type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Order (optional)</label>
                <input name="order" type="number" defaultValue="0" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
              </div>
              <button type="submit" className="btn-primary">Add Category</button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3>Categories</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(cat => (
                <li key={cat._id.toString()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-sm)' }}>
                  <span>{cat.name}</span>
                  <form action={async () => {
                    'use server';
                    await deleteCategory(cat._id.toString());
                  }}>
                    <button type="submit" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </form>
                </li>
              ))}
              {categories.length === 0 && <li>No categories.</li>}
            </ul>
          </div>
        </div>

        {/* Menu Items Section */}
        <div>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3>Add Menu Item</h3>
            <form action={createMenuItem} encType="multipart/form-data" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                <input name="name" type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                <textarea name="description" required rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Price ($)</label>
                <input name="price" type="number" step="0.01" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
                <select name="category" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }}>
                  <option value="">Select...</option>
                  {categories.map(cat => (
                    <option key={cat._id.toString()} value={cat._id.toString()}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image File</label>
                <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--text-muted)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input name="isAvailable" type="checkbox" id="isAvailable" defaultChecked />
                <label htmlFor="isAvailable">Available</label>
              </div>
              <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>Add Menu Item</button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {menuItems.map((item: any) => (
              <div key={item._id.toString()} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>{item.description}</p>
                    </div>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span className="status-badge" style={{ backgroundColor: '#e2e3e5', color: '#383d41', fontSize: '0.7rem' }}>
                      {item.category?.name || 'Unknown'}
                    </span>
                    <form action={async () => {
                      'use server';
                      await deleteMenuItem(item._id.toString());
                    }}>
                      <button type="submit" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
