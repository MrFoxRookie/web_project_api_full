const Card = require("../models/card");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: "Error del servidor" }));
}; //Verificado//

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Datos inválidos" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado//

module.exports.removeCard = (req, res) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== userId) {
        return res.status(403).send({
          message:
            "No tienes los permisos necesarios para eliminar esta tarjeta",
        });
      }

      return Card.findByIdAndDelete(req.params.cardId).then(() => {
        res.send({ data: card });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Id no coincide con ninguna carta" });
      }

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Formato del Id invalido" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado//

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Id no coincide con ninguna carta" });
      }

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Formato del Id invalido" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Id no coincide con ninguna carta" });
      }

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Formato del Id invalido" });
      }
      res.status(500).send({ message: "Error del servidor" });
    });
}; //Verificado
