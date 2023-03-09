import { SessionData, SessionStore } from "next-session/lib/types";
import { Session } from "../models/session";
import { ObjectId } from 'mongodb';
import client from "./DButils";

// Source: https://github.com/hoangvvo/next-session/blob/master/src/memory-store.ts

export default class MemoryStore implements SessionStore {

    async get(sid: string): Promise<SessionData | null> {
        await client.connect();
        const database = client.db("movietracker");
        const sessionCollection = database.collection('session');
        const sessionDocument = (await sessionCollection.findOne({ uuid: sid }))?.data;

        if (sessionDocument) {
            const session = JSON.parse(sessionDocument, (key, value) => {
                if (key === "expires") return new Date(value);
                return value;
            }) as SessionData;
            if (
                session.cookie.expires &&
                session.cookie.expires.getTime() <= Date.now()
            ) {
                await this.destroy(sid);
                return null;
            }
            return session;
        }
        return null;
    }

    async set(sid: string, sess: SessionData) {
        await client.connect();
        const database = client.db("movietracker");
        const sessionCollection = database.collection('session');
        let sessionDocument = await sessionCollection.findOne({ uuid: sid });

        if (!sessionDocument) {
            sessionDocument = {
                _id: new ObjectId(),
                uuid: sid,
                data: JSON.stringify(sess)
            };
        }
        sessionDocument!.uuid = sid
        sessionDocument!.data = JSON.stringify(sess)
        await sessionCollection.updateOne(
            { _id: new ObjectId(sessionDocument._id) },
            { $set: sessionDocument },
            { upsert: true }
        );
    }

    async destroy(sid: string) {
        await client.connect();
        const database = client.db("movietracker");
        const sessionCollection = database.collection('session');
        let sessionDocument = await sessionCollection.findOne({ uuid: sid });
        if (sessionDocument) {
            await sessionCollection.deleteOne(sessionDocument);
        }
    }

    async touch(sid: string, sess: SessionData) {
        return this.set(sid, sess)
    }
}