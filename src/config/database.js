const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...'.yellow);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`✅ Database: ${conn.connection.name}`.green);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`.red.bold);
    console.error(`   ${error.message}`.red);
    console.error(`\n📋 Troubleshooting:`.yellow);
    console.error(`1. Check MONGODB_URI in .env file`.yellow);
    console.error(`2. Verify network access in MongoDB Atlas`.yellow);
    console.error(`3. Check username/password`.yellow);
    process.exit(1);
  }
};

module.exports = connectDB;