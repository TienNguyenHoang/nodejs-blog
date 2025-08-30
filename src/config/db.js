import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('connect successfully!');
    } catch (err) {
        console.log('connect failure!');
    }
}

export default { connect };
