const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function dbConnect() {
  // Connect to MongoDB
  try {
    mongoose.set('debug', true);
    mongoose.Promise = global.Promise;

    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    });

    console.log(`MongoDB successfully connected ${process.env.MONGODB_URI}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
  }

  const dbConnection = mongoose.connection;

  // Event handlers for MongoDB connection
  dbConnection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Close the Mongoose connection if the Node process ends
  process.on('SIGINT', () => {
    dbConnection.close(() => {
      console.log('MongoDB connection closed due to Node process termination');
      process.exit(0);
    });
  });
}

module.exports = { dbConnect };