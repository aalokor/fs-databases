const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const { Session, User } = require("../models");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message);

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      error: error.errors.map((e) => e.message),
    });
  }

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: "database error" });
  }

  next(error);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  const token = authorization.substring(7);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch {
    return res.status(401).json({ error: "token invalid" });
  }

  const session = await Session.findOne({ where: { token } });
  if (!session) {
    return res.status(401).json({ error: "session expired or logged out" });
  }

  const user = await User.findByPk(decodedToken.id);
  if (!user || user.disabled) {
    return res.status(403).json({ error: "user disabled" });
  }

  req.user = user;
  req.token = token;
  req.decodedToken = decodedToken;

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
