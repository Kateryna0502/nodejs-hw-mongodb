import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (message) => {
  return await transporter.sendMail(message);
};


// import nodemailer from 'nodemailer';

// import { SMTP } from '../constants/index.js';
// import { env } from '../utils/env.js';

// const transporter = nodemailer.createTransport({
//   host: env(SMTP.SMTP_HOST),
//   port: Number(env(SMTP.SMTP_PORT)),
//   auth: {
//     user: env(SMTP.SMTP_USER),
//     pass: env(SMTP.SMTP_PASSWORD),
//   },
// });

// export const sendEmail = async (options) => {
//   return await transporter.sendMail(options);
// };
