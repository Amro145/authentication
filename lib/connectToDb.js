import mongoose from 'mongoose';

const connectToDb = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined in the environment variables.');
    }

    await mongoose.connect(dbUrl);

    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
};

export default connectToDb;
