import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export async function registerUser(payload) {
  try {
    const user = await User.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    payload.password = await bcrypt.hash(payload.password, 10);
    return await User.create(payload);
  } catch (error) {
    throw createHttpError(500, 'Server error');
  }
}

export async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError(401, 'Email or password is incorrect');

    // Видаляємо стару сесію для користувача або оновлюємо її, залежно від логіки
    await Session.deleteOne({ userId: user._id });

    return await createSession(user._id);
  } catch (error) {
    throw createHttpError(500, 'Login error');
  }
}

export function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  try {
    const session = await Session.findById(sessionId);
    if (!session) throw createHttpError(401, 'Session not found');

    // Порівняння хешованого `refreshToken`
    const isValidToken = await bcrypt.compare(refreshToken, session.refreshToken);
    if (!isValidToken) throw createHttpError(401, 'Session not found');

    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Refresh token is expired');
    }

    // Видаляємо стару сесію і створюємо нову
    await Session.deleteOne({ _id: session._id });
    return await createSession(session.userId);
  } catch (error) {
    throw createHttpError(500, 'Refresh session error');
  }
}

async function createSession(userId) {
  const accessToken = uuidv4();
  const refreshToken = uuidv4();
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken: hashedRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  // Повертаємо дані для відповіді, але не зберігаємо відкритий `refreshToken` у базі даних
  return {
    accessToken: session.accessToken,
    refreshToken, // Повертаємо незахешований варіант тільки для клієнта
  };
}
