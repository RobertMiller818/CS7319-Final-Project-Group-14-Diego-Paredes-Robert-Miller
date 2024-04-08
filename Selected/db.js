require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
});

async function connect() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB Atlas");
        return client;
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
        process.exit(1);
    }
}

const dbConnection = connect();
module.exports = dbConnection;
