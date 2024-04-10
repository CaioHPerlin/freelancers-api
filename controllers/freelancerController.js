const { connectToDatabase } = require('../db');

const getAll = async (req, res) => {
    const db = await connectToDatabase();
    const client = db.client;
    try{
        const freelancersCollection = db.collection('freelancers');
        const freelancers = await freelancersCollection.find().toArray();
        res.status(200).json(freelancers);
    } catch (err) {
        console.error('Error when listing freelancers:', err);
        res.status(500).json({ message: 'internal server error'});
    } finally {
        await client.close();
    }
};

const create = async (req, res) => {
    const db = await connectToDatabase();
    const client = db.client;
    try{
        const freelancersCollection = db.collection('freelancers');
        await freelancersCollection.insertOne(req.body);
        res.status(201).json(req.body);
    } catch (err) {
        console.error('Error when creating a freelancer:', err);
        res.status(500).json({ message: 'internal server error'});
    } finally {
        await client.close();
    }
}

//ONLY FOR DEVELOPMENT
const wipe = async (req, res) => {
    const db = await connectToDatabase();
    const client = db.client;
    try{
        const freelancersCollection = db.collection('freelancers');
        await freelancersCollection.deleteMany();
        res.status(200).json({"message": "database successfully wiped"})
    } catch (err) {
        console.error('Error when wiping databse:', err);
        res.status(500).json({ message: 'internal server error'});
    } finally {
        await client.close();
    }
}

module.exports = {
    getAll,
    create,
    wipe
};