import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../models/user";
import client from "../../utils/DButils";

export default async function updateUserType(
    req: NextApiRequest,
    res: NextApiResponse<{ status: string, message?: string[], errors?: string[] }>
) {

    try {
        await client.connect();

        const database = client.db("movietracker");
        const usersCollection = database.collection<User>("users");

        const usersToUpdate = await usersCollection.find({}).toArray();

        for (const user of usersToUpdate) {
            const updatedUser = {
                ...user,
                userType: "normal",
            };

            await usersCollection.updateOne(
                { _id: new ObjectId(user._id) },
                { $set: { userType: "normal" } }
            );
        }

        console.log("User types updated successfully.");
    } catch (error) {
        console.error("Error updating user types:", error);
    } finally {
        await client.close();
    }
}
