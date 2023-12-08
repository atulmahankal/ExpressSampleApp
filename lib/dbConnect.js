const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function dbConnect() {
  // Connect to MongoDB
  const db_conn = process.env.DB_CONNECTION;
  const db_pwd = process.env.DB_PASSWORD;
  const db_usr = process.env.DB_USERNAME ? process.env.DB_USERNAME + ":" + db_pwd + "@" : "";
  const db_host = process.env.DB_HOST;
  const db_port = process.env.DB_PORT ? ":" + process.env.DB_PORT : "";
  const db_database = process.env.DB_DATABASE;
  const MONGODB_URI = `${db_conn}://${db_usr}${db_host}${db_port}/${db_database}`;

  try {
    console.log(`Connecting to ${MONGODB_URI}`);
    
    mongoose.set('debug', true);
    mongoose.Promise = global.Promise;

    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    });

    console.log('MongoDB connected successfully');
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