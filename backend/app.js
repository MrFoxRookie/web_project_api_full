const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '68ed695234846756829d51b2'
  };

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);


app.listen(PORT, () => {
  console.log(`La aplicación está detectando el puerto ${PORT}`);
});

