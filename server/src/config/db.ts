import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing in .env file"); // fail early with a clear message

  await mongoose.connect(uri); // opens the connection pool to Atlas
  console.log(`MongoDB connected successfully: ${mongoose.connection.host}`);
};
