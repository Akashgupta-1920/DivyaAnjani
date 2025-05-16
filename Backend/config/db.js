const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,  // 5 seconds timeout
      socketTimeoutMS: 45000,         // 45 seconds socket timeout
    });
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    // Specific error handling
    if (error.name === 'MongoServerError') {
      switch(error.code) {
        case 8000: // Invalid credentials
          console.error('Authentication failed. Please verify:');
          console.error('1. MongoDB Atlas username/password in .env');
          console.error('2. IP is whitelisted in Atlas');
          break;
        case 13:   // Unauthorized
          console.error('Insufficient permissions for database operations');
          break;
      }
    }
    
    process.exit(1);
  }
};

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;