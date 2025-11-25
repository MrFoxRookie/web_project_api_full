const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { auth } = require("./middlewares/auth");
const { celebrate, Joi } = require("celebrate");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://localhost:27017/aroundb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

// app.post("/signup", createUser);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);

app.use("/", usersRouter);
app.use("/", cardsRouter);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
});

app.listen(PORT, () => {
  console.log(`La aplicación está detectando el puerto ${PORT}`);
});
