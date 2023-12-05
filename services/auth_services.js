var jwt = require("jsonwebtoken");

const { fail } = require("../helpers/response");

const { Op } = require("sequelize");

const UserModel = require("../model/user_model");

function validateToken(req, res, next) {
  let token_full = req.headers["authorization"];
  if (!token_full) token_full = "";
  let token = token_full.split(" ")[1];

  jwt.verify(token, "#Abcasdfqwr", (err, payload) => {
    if (err) {
      const msg = "Acesso negado - Token invalido";
      logger.log("info", msg);

      res.status(401).json(fail("Acesso negado - Token invalido"));
      return;
    }

    req.user = payload.user;
    next();
  });
}

function validateAdmin(req, res, next) {
  const { isAdmin } = req.user;

  if (isAdmin && isAdmin == true) {
    next();
  } else {
    res.status(401).json(fail("Acesso negado - Usuário não é administrador"));
  }
}

async function validId(req, res, next) {
  let id = parseInt(req.params.id);

  if (id != id || id < 1) {
    res.status(500).json(fail("Por favor digite um ID Válido."));
    return;
  }

  const user = await UserModel.findByPk(id);

  if (user) {
    req.data = user;
    return next();
  }

  res.status(404).json(fail("Usuário não encontrado"));
}

async function validUsername(req, res, next) {
  let username = req.params.username;

  if (!username) {
    res.status(500).json(fail("Por favor digite um nome de usuário válido."));
    return;
  }

  const user = await UserModel.findOne({
    where: {
      username: {
        [Op.like]: "%" + username + "%",
      },
    },
  });

  if (user) {
    req.data = user;
    return next();
  }

  res.status(404).json(fail("Usuário não encontrado"));
}

module.exports = {
  validateToken,
  validateAdmin,
  validId,
  validUsername,
};
