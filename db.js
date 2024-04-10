const { MongoClient } = require('mongodb');

const URI = process.env.API_URI;

const connectToDatabase = async () => {
    try{
        const client = new MongoClient(URI);
        await client.connect();
        return client.db('sebrae-1')
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err
    }
};

module.exports = {
    connectToDatabase
};

