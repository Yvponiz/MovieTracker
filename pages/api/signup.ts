import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import client from "../../utils/DButils";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string, errors: string[] }>
) {
  try {
    await client.connect();
    const { username, email, password, confPassword } = req.body
    const emailReg = /@/;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (password !== confPassword) {
      res.status(400).json({ status: "error", errors: ["Passwords must be identical"] })
      return
    }
    else if (emailReg.test(email) == false) {
      res.status(400).json({ status: "error", errors: ["Email is not valid"] })
      return
    }
    else if(username.length < 4){
      res.status(400).json({ status: "error", errors: ["Username must be at least 4 characters"] })
      return
    }
    else if(password.length < 7){
      res.status(400).json({ status: "error", errors: ["Password must be at least 7 characters"] })
      return
    }

    const database = client.db("movietracker");
    const users = database.collection<User>('users');
    const existingUsername = await users.findOne({ username });
    const existingEmail = await users.findOne({ email });

    if (existingUsername) {
      res.status(400).json({ status: "error", errors: ["Username is already taken"] });
      return;
    }
    if (existingEmail) {
      res.status(400).json({ status: "error", errors: ["Email is already taken"] });
      return;
    }

    const newUser: User = {
      username: username,
      email: email,
      password: hashedPassword,
      lists: [],
      userType: 'normal'
    }
    const result = await users.insertOne(newUser);

    if (result.acknowledged) {
      console.log(`User has been saved with id: ${result.insertedId}`);
    } else {
      console.log('Failed to save user');
    }

    return res.status(201).json({ status: "success", errors: [] })

  } catch (error: any) {
    return res.status(500).send(error.toString())
  } finally {
    await client.close();
  }
};
