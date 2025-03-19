import mongoose from "mongoose";
import User from "./models/users.js";

export default async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "movies4home",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error("Couldn't connect to database:", error);
  }
}
