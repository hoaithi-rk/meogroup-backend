require('dotenv').config();
const mongoose = require('mongoose');

const DB_URI = process.env.MONGODB_URI
    .replace('<username>', process.env.USERNAME)
    .replace('<password>', process.env.PASSWORD)
    .replace('<host>', process.env.HOST)
    .replace('<database-name>', process.env.DATABASE_NAME)

const connectDB = async () => {
    try {
        console.log(DB_URI)
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connect DB successfully');
    } catch (error) {
        console.log('Error', error);
        process.exit(1);
    }
}

module.exports = connectDB;
