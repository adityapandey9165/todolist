import { connectToDatabase } from "../../mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");
    const tasks = await collection.find().toArray();
    res.status(200).json(tasks);
  } else if (req.method === "POST") {
    const { title, desc } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection("tasks");
    const result = await collection.insertOne({ title, desc });
    res.status(201).json(result.ops[0]);
  } else {
    res.status(405).end(); // Method not allowed
  }
}
