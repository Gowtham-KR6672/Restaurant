import bcrypt from 'bcryptjs';
import User from '../models/User';
import dbConnect from '../lib/db';

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ username: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists');
    } else {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'System Admin',
        username: 'admin@example.com',
        passwordHash,
        role: 'admin'
      });
      console.log('Admin user created successfully (username: admin@example.com, password: Admin@123)');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit(0);
  }
}

seed();
