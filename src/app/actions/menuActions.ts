'use server';

import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import MenuItem from '@/models/MenuItem';
import { ImageNode1, ImageNode2, ImageNode3 } from '@/models/Image';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  await dbConnect();
  const name = formData.get('name') as string;
  const orderStr = formData.get('order') as string;
  
  await Category.create({
    name,
    order: orderStr ? parseInt(orderStr, 10) : 0
  });
  revalidatePath('/admin/menu');
}

export async function deleteCategory(id: string) {
  await dbConnect();
  await Category.findByIdAndDelete(id);
  // Also delete associated menu items
  await MenuItem.deleteMany({ category: id });
  revalidatePath('/admin/menu');
}

export async function createMenuItem(formData: FormData) {
  await dbConnect();
  
  let imageUrl = '';
  const file = formData.get('imageFile') as File | null;
  
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type;
    const filename = file.name;
    
    // Distribute images randomly across the 3 image databases
    const nodeIndex = Math.floor(Math.random() * 3) + 1;
    let imageDoc;
    
    if (nodeIndex === 1) {
      imageDoc = await ImageNode1.create({ filename, data: buffer, contentType });
    } else if (nodeIndex === 2) {
      imageDoc = await ImageNode2.create({ filename, data: buffer, contentType });
    } else {
      imageDoc = await ImageNode3.create({ filename, data: buffer, contentType });
    }
    
    imageUrl = `/api/images/${nodeIndex}/${imageDoc._id.toString()}`;
  }

  await MenuItem.create({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl,
    category: formData.get('category') as string,
    isAvailable: formData.get('isAvailable') === 'on'
  });
  revalidatePath('/admin/menu');
}

export async function deleteMenuItem(id: string) {
  await dbConnect();
  await MenuItem.findByIdAndDelete(id);
  revalidatePath('/admin/menu');
}
