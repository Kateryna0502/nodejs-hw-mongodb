import fs from 'node:fs/promises';
import path from 'node:path';

import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import handlebars from "handlebars";
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';



import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import { SMTP, TEMPLATES_DIR } from '../constants/index.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError(409, 'Email already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw createHttpError(401, 'Unauthorized');



await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        env('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    try {
        await sendEmail({
            from: env(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html,
        });
    } catch (error) {
        console.error(error);
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
};


// export const resetPassword = async (token, password) => {
//     try {
//         const entries = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findOne({ _id: entries.sub, email: entries.email });

//         if (user === null) {
//             throw createHttpError(404, 'User not found');
//         }

//         await Session.deleteOne({ userId: user._id });

//         const encryptedPassword = await bcrypt.hash(password, 10);

//         await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
//     } catch (error) {
//         if (
//             error.name === 'JsonWebTokenError' ||
//             error.name === 'TokenExpiredError'
//         ) {
//             throw createHttpError(401, 'Token error');
//         }

//         throw error;
//     }
// };

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
