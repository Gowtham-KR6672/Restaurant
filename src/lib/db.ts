import mongoose, { Connection } from 'mongoose';

const URIs = {
  core: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_qr',
  orders: process.env.MONGODB_URI_ORDERS || '',
  sales: process.env.MONGODB_URI_SALES || '',
  images1: process.env.MONGODB_URI_IMAGES_1 || '',
  images2: process.env.MONGODB_URI_IMAGES_2 || '',
  images3: process.env.MONGODB_URI_IMAGES_3 || '',
};

let cached = (global as any).mongooseConnections;

if (!cached) {
  cached = (global as any).mongooseConnections = {};
}

/**
 * Returns a synchronous connection object.
 * Mongoose will buffer operations until the connection is established.
 * Use this in your model definitions.
 */
export function getDb(name: keyof typeof URIs): Connection {
  if (!URIs[name]) {
    throw new Error(`Please define the connection URI for database: ${name}`);
  }
  
  if (!cached[name]) {
    cached[name] = mongoose.createConnection(URIs[name], {
      bufferCommands: true, // Buffering is required when returning synchronous connections
    });
  }
  
  return cached[name];
}

/**
 * Utility function to ensure all databases are connected.
 * This can be awaited in Server Actions and API Routes.
 */
export default async function dbConnect() {
  const connections = [
    getDb('core'),
    getDb('orders'),
    getDb('sales'),
    getDb('images1'),
    getDb('images2'),
    getDb('images3')
  ];

  await Promise.all(connections.map(conn => conn.asPromise()));
  
  return {
    coreDb: getDb('core'),
    orderDb: getDb('orders'),
    salesDb: getDb('sales'),
    imageDb1: getDb('images1'),
    imageDb2: getDb('images2'),
    imageDb3: getDb('images3')
  };
}
