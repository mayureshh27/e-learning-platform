import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalTeardown() {
    const mongoServer = (global as typeof globalThis & { __MONGO_SERVER__: MongoMemoryServer }).__MONGO_SERVER__;
    if (mongoServer) {
        await mongoServer.stop();
    }
}
