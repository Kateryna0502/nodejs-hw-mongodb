import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

// const DB_URI = `mongodb+srv://Kateryna0502:Nasta2009@mycluster.tytx1.mongodb.net`;


async function initMongoConnection() {
    try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

     await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Node-hw`,
    );
     console.log("Mongo connection successfully established!");
 } catch (error) {
     console.error(error);
     throw error;
 }
}
export { initMongoConnection };
