import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from "../services/auth.js";

export async function registerController(req, res) {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    if (!payload.name || !payload.email || !payload.password) {
      return res
        .status(400)
        .send({ message: "Name, email, and password are required" });
    }
    const registeredUser = await registerUser(payload);
    res
      .status(201)
      .send({
        message: "Successfully registered a user!",
        data: registeredUser,
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Registration failed", error: error.message });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }
    const session = await loginUser(email, password);
    if (!session) {
      return res.status(401).send({ message: "Login failed" });
    }
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: session.refreshTokenValidUntil,
    });
    res.cookie("sessionId", session._id, {
      httpOnly: true,
      secure: true,
      expires: session.refreshTokenValidUntil,
    });
    res
      .status(200)
      .send({
        message: "Successfully logged in a user!",
        data: { accessToken: session.accessToken },
      });
  } catch (error) {
    res.status(500).send({ message: "Login error", error: error.message });
  }
}

export async function logoutController(req, res) {
  try {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return res.status(400).send({ message: "Session ID not found" });
    }
    await logoutUser(sessionId);
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");
    res.status(204).end();
  } catch (error) {
    res.status(500).send({ message: "Logout failed", error: error.message });
  }
}

export async function refreshController(req, res) {
  try {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) {
      return res
        .status(400)
        .send({ message: "Session ID and refresh token are required" });
    }
    const session = await refreshSession(sessionId, refreshToken);
    if (!session) {
      return res.status(401).send({ message: "Session refresh failed" });
    }
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: session.refreshTokenValidUntil,
    });
    res.cookie("sessionId", session._id, {
      httpOnly: true,
      secure: true,
      expires: session.refreshTokenValidUntil,
    });
    res
      .status(200)
      .send({
        message: "Successfully refreshed a session!",
        data: { accessToken: session.accessToken },
      });
  } catch (error) {
    res.status(500).send({ message: "Refresh error", error: error.message });
  }
}
