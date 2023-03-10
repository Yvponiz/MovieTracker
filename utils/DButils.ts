import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";

dotenv.config();

const devUri: string = process.env.MONGODB_DEV_URI ?? '';
const prodUri: string = process.env.MONGODB_PROD_URI ?? '';
const uri: string = process.env.NODE_ENV === 'production' ? prodUri : devUri;
const client = new MongoClient(uri);

export default client;
