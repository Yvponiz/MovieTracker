import * as dotenv from "dotenv";
import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

const user: string = process.env.USER ?? '';
const password: string = process.env.PASSWORD ?? '';
const uri: string = `mongodb+srv://${user}:${password}@movietracker.mnxjf0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string, errors: string[] }>
) {

  try {
    const { username, email, password, confPassword } = req.body // arguments reçu du form dans signupForm.tsx
    const emailReg = /@/;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    if (password !== confPassword) {
      res.status(400).json({ status: "erreur", errors: ["Les deux mots de passe ne sont pas identiques"] })
      return
    }
    else if (emailReg.test(email) == false) {
      res.status(400).json({ status: "erreur", errors: ["Le courriel n'est pas valide"] })
      return
    }
    
    const newUser: User = {
      username: username,
      email: email,
      password: hashedPassword
    }
    const database = client.db("movietracker");
    const users = database.collection<User>('users');
    
    const result = await users.insertOne(newUser);
    console.log(`User has been saved with id: ${result.insertedId}`);

    return res.json({ status: "success", errors: [] })

  } catch (error: any) {
    return res.status(500).send(error.toString())
  } finally {
    await client.close();
  }
}
