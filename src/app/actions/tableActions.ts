'use server';

import dbConnect from '@/lib/db';
import Table from '@/models/Table';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function createTable(formData: FormData) {
  await dbConnect();
  
  const numberStr = formData.get('number') as string;
  const number = parseInt(numberStr, 10);
  
  if (isNaN(number)) throw new Error('Invalid table number');
  
  const existingTable = await Table.findOne({ number });
  if (existingTable) throw new Error('Table number already exists');
  
  const qrToken = uuidv4();
  
  await Table.create({
    number,
    qrToken
  });
  
  revalidatePath('/admin/tables');
}

export async function deleteTable(id: string) {
  await dbConnect();
  await Table.findByIdAndDelete(id);
  revalidatePath('/admin/tables');
}
