'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  await dbConnect();
  
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error('Username already exists');
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  await User.create({
    name,
    username,
    passwordHash,
    role
  });
  
  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  await dbConnect();
  const user = await User.findById(id);
  // Prevent deleting the default admin
  if (user && user.username === 'admin') {
    throw new Error('Cannot delete default admin');
  }
  await User.findByIdAndDelete(id);
  revalidatePath('/admin/users');
}
