// mongodb.js
import { MongoClient } from "mongodb";

// Define your MongoDB connection string
const uri =
  "mongodb+srv://adityapandey9165:Aditya123@todolist.j00g1tv.mongodb.net/";

// Create a function to connect to the database
async function connectToDatabase() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("todolist");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export { connectToDatabase };
