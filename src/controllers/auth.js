import { THIRTY_DAYS } from '../constants/index.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetToken,
  resetPassword,
} from "../services/auth.js";

export async function registerController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: registeredUser,
  });
}

export async function loginController(req, res) {
   const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export async function logoutController(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId === "string") {
    await logoutUser(sessionId);
  }

  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: "Session refreshed",
    data: {
      accessToken: session.accessToken,
    },
  });
}

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  await requestResetToken(email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;

  await resetPassword(password, token);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
