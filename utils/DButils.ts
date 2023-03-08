import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";

dotenv.config();

const user: string = process.env.USER ?? '';
const password: string = process.env.PASSWORD ?? '';
const uri: string = `mongodb+srv://${user}:${password}@movietracker.mnxjf0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export default client;
