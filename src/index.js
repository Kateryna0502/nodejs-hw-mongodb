import express from 'express';
import 'dotenv/config';
import {initMongoConnection } from "./db/initMongoConnection.js";

const app = express();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
 try {
   await initMongoConnection();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });
 } catch (error) {
   console.error(error);
 }
}

bootstrap();


// g3eQce8TRTb8TUof
// mongodb+srv://Kateryna0502:Nasta2009@mycluster.tytx1.mongodb.net/
