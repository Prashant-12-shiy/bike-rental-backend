import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }

    const conn = await mongoose.connect(mongoUrl);
    console.log(`Connected to MongoDB at ${conn.connection.host}`);
  } catch (error: any) {
    console.log("Error connecting to MongoDB", error.message);
    process.exit(1); // Exit process with failure
  }
};
