import mongoose from "mongoose";

// This helper connects to MongoDB and caches the connection.
// In Next.js, during development, hot-reload keeps running the file
// so we cache the connection on a global object to prevent opening
// hundreds of DB connections on every file save.

const MONGODB_URI = process.env.MONGODB_URI as string;

// We store the cached connection on the Node.js global object
// so it persists across hot reloads in development mode.
let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Check that the user has filled in .env with real credentials
  if (!MONGODB_URI || MONGODB_URI.includes("<username>") || MONGODB_URI === "") {
    throw new Error(
      "Please open the .env file and set MONGODB_URI to your real MongoDB Atlas connection string."
    );
  }

  // If already connected, reuse the existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection is in flight, start one
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((m) => {
      console.log("✅ Connected to MongoDB Atlas successfully!");
      return m;
    });
  }

  // Await the connection and cache it
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise so a future request can retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
