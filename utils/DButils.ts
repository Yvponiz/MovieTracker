import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";

dotenv.config();

// Replace the uri string with your connection string.
const user: string = process.env.USER ?? '';
const password: string = process.env.PASSWORD ?? '';
const uri: string = `mongodb+srv://${user}:${password}@movietracker.mnxjf0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function run() {
  try {
    const database = client.db('movietracker');
    const users = database.collection('users');
    // const movies = database.collection('movies');
    // // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'viande' };
    const movie = await users.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);