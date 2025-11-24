const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ForbiddenError = require("../errors/forbidden-error");
const ConflictError = require("../errors/conflict-error");

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
        return res.status(400).send({ message: "Formato del Id inválido3" });
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

// module.exports.getUser = (req, res, next) => {
//   User.findById(req.params.userId)
//     .orFail(() => new NotFoundError('Id no coincide con ningún usuario'))
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new BadRequestError('Formato del Id inválido'));
//       }
//       return next(err); // siempre pasa todo al manejador central
//     });
// };

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

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .send({ message: "Contraseña o correo electrónico incorrecto" });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res
        .status(401)
        .send({ message: "Contraseña o correo electrónico incorrecto" });
    }
    const token = jwt.sign({ _id: user._id }, "string-random", {
      expiresIn: "7d",
    });
    res.send({ token });
  } catch (err) {
    res.status(500).send({ message: "Error en el servidor" });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "Usuario inexistente" });
    }
    res.send({ data: user });
  } catch (err) {
    res.status(500).send({ message: "Error en el servidor" });
  }
};

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .select("+password") //recordar que esto es para forzar a Mongoose a dar el password
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(
//           new Error("Contraseña o correo electrónico incorrecto")
//         );
//       }
//       return bcrypt
//         .compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(
//               new Error("Contraseña o correo electrónico incorrecto")
//             );
//           }
//           const token = jwt.sign({ _id: user._id }, "string-random", {
//             expiresIn: "7d",
//           });
//           res.send({ token });
//         })
//         .catch((err) => {
//           res.status(401).send({ message: err.message });
//         });
//     });
// };
