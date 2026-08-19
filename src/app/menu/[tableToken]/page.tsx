import dbConnect from '@/lib/db';
import TableModel from '@/models/Table';
import CategoryModel from '@/models/Category';
import MenuItemModel from '@/models/MenuItem';
import CustomerMenu from './CustomerMenu';

export default async function MenuPage({ params }: { params: Promise<{ tableToken: string }> }) {
  // Await params in Next.js 15
  const { tableToken } = await params;
  
  await dbConnect();
  
  const table = await TableModel.findOne({ qrToken: tableToken }).lean();
  
  if (!table) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: 'red' }}>Invalid Table QR Code</h2>
        <p style={{ color: 'var(--text-muted)' }}>Please scan a valid QR code on your table.</p>
      </div>
    );
  }

  const categories = await CategoryModel.find().sort({ order: 1 }).lean();
  const menuItems = await MenuItemModel.find({ isAvailable: true }).lean();

  const serializedCategories = categories.map(c => ({ _id: c._id.toString(), name: c.name }));
  const serializedItems = menuItems.map(m => ({
    _id: m._id.toString(),
    name: m.name,
    description: m.description,
    price: m.price,
    imageUrl: m.imageUrl || '',
    category: m.category.toString()
  }));

  return (
    <CustomerMenu 
      tableId={table._id.toString()} 
      tableNumber={table.number} 
      categories={serializedCategories} 
      menuItems={serializedItems} 
    />
  );
}
