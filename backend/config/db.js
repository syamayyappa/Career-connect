const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/careerconnect';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}).`);
    console.log('Starting embedded in-memory MongoDB server for development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      
      const conn = await mongoose.connect(memUri);
      console.log(`In-Memory MongoDB Connected successfully at: ${memUri}`);

      // Seed initial dummy users and vacancies
      try {
        const { seedDataDirectly } = require('../seed');
        if (typeof seedDataDirectly === 'function') {
          console.log('Populating initial seed data...');
          await seedDataDirectly();
          console.log('Initial seed data populated.');
        }
      } catch (seedErr) {
        console.warn('Initial seeding note:', seedErr.message);
      }

      return conn;
    } catch (memError) {
      console.error(`Failed to initialize in-memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

// Graceful cleanup
process.on('SIGINT', async () => {
  if (mongod) {
    await mongod.stop();
  }
  process.exit(0);
});

module.exports = connectDB;

