import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const url = `mongodb://${host}:${port}`;

        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.dbName = database;

        // Connect to the MongoDB client
        this.client.connect()
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((err) => {
                console.error('MongoDB connection error:', err.message);
            });
    }

    // Function to check if MongoDB is alive
    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected();
    }

    // Function to get a database instance
    getDb() {
        return this.client.db(this.dbName);
    }

    // Function to get the number of users in the 'users' collection
    async nbUsers() {
        const db = this.getDb();
        const collection = db.collection('users');
        return collection.countDocuments();
    }

    // Function to get the number of files in the 'files' collection
    async nbFiles() {
        const db = this.getDb();
        const collection = db.collection('files');
        return collection.countDocuments();
    }
}

// Exporting an instance of DBClient
const dbClient = new DBClient();
export default dbClient;

