const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorRouter = require("./controllers/authors");
const resetRouter = require("./controllers/reset");
const readingListsRouter = require("./controllers/reading_lists");

const { unknownEndpoint, errorHandler } = require("./util/middleware");

app.use(express.json());

app.get("/", async (req, res) => {
  res.sendStatus(200);
});

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/authors", authorRouter);
app.use("/api/reset", resetRouter);
app.use("/api/readinglists", readingListsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
