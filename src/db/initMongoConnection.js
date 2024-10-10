import mongoose from "mongoose";
import { env } from '../utils/env.js';

import dotenv from 'dotenv';
dotenv.config();

// const DB_URI = `mongodb+srv://Kateryna0502:Nasta2009@mycluster.tytx1.mongodb.net`;


async function initMongoConnection() {
    try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

        await mongoose.connect(
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
        );

     console.log("Mongo connection successfully established!");
 } catch (error) {
     console.error(error);
     throw error;
 }
}
export { initMongoConnection };
