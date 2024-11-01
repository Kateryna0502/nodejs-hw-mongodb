import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";

export async function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || typeof authorization !== "string") {
      return next(createHttpError(401, "Unauthorized"));
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(createHttpError(401, "Unauthorized"));
    }

    const accessToken = parts[1];
    const session = await Session.findOne({ accessToken });

    if (!session) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (new Date() > session.accessTokenValidUntil) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return next(createHttpError(401, "Unauthorized"));
    }

    req.user = { id: user._id, name: user.name };

    next();
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
}
