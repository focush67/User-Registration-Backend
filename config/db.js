import mongoose from 'mongoose';
import {config} from "dotenv";

config();

let isConnected = false;

export const connectDB = async() => {
    if(isConnected){
        console.log("Using existing connected instance");
        return;
    }

    try{
        if(mongoose.connection.readyState === 1){
            console.log(`Connected to DB Already`);
            isConnected = true;
        }
        else{
            const conn = await mongoose.connect(process.env.MONGO_URL)
            isConnected = true;
            console.log(`MongoDB Connected : ${conn.connection.host}`);
        }
    }catch(error){
        console.error(`Failed to connect to DB: ${error}`);
        process.exit(1);
    }
}