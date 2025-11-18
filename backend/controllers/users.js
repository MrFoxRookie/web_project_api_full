const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: "Error del servidor" }));
}; //Verificado

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Id no coincide con ningún usuario" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Formato del Id inválido" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Formato para la información del usuario invalidos",
        });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Id no coincide con ningún usuario" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Formato del Id inválido" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Id no coincide con ningún usuario" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Formato del Id inválido" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado//
