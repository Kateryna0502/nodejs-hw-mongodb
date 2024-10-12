import express from 'express';
import 'dotenv/config';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactById } from './services/contacts.js';


export const setupServer = () => {
    const app = express();
    app.use(cors());
  app.use(express.json());


  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );


    app.get('/contacts', async (req, res) => {

            const contacts = await getAllContacts();
            res.status(200).json({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts,
            });
       });


    app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
    });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
  });
};






// const PORT = process.env.PORT || 3000;
// export const setupServer = () => {
//   const app = express();
//   app.use(cors());

//   app.use(express.json());

//   app.use(
//     pino({
//       transport: {
//         target: 'pino-pretty',
//       },
//     }),
//   );
// }



// app.get('/contacts', async (req, res) => {
//   try {
//     const contacts = await getAllContacts();
//     res.status(200).json({
//       status: 200,
//       message: "Successfully found contacts",
//       data: contacts,
//     });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ message: 'Error retrieving contacts' });
//   }
// });


// app.get('/contacts/:contactId', async (req, res) => {
//   const { contactId } = req.params;
//   try {
//     const contact = await getContactById(contactId);
//     if (!contact) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.status(200).json({
//       status: 200,
//       message: `Successfully found contact with id ${contactId}!`,
//       data: contact,
//     });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ message: 'Error retrieving contact' });
//   }
// });


// app.use((req, res) => {
//   res.status(404).json({ message: 'Not found' });
// });









// export const setupServer = () => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// };

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
