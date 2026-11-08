import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// --- DEBUG LOG (Remove or comment out once fixed) ---
console.log("DEBUG - MONGODB_URI exists:", !!MONGODB_URI);
console.log("DEBUG - MONGODB_URI value (masked):", MONGODB_URI ? MONGODB_URI.substring(0, 15) + "..." : "UNDEFINED");

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your Vercel project settings or .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
