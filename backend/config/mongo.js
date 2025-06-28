import mongoose from "mongoose";

export async function databaseM() {
  // MongoDB connection using Mongoose
  await mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB.");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err.message);
    });
}
