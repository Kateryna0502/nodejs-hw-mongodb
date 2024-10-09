import express from 'express';
import 'dotenv/config';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactsById } from './services/contacts.js';

// import {initDBConnection } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

const PORT = process.env.PORT || 3000;

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts",
      data: contacts,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
});


app.get('/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error retrieving contact' });
  }
});


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});


const setupServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// async function bootstrap() {
//  try {
//    await initDBConnection();
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   });
//  } catch (error) {
//    console.error(error);
//  }
// }

// bootstrap();
