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

module.exports = {
  unknownEndpoint,
  errorHandler,
};
