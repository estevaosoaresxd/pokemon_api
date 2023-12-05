const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../model/user_model");
const { sucess, fail } = require("../helpers/response");

async function authUser(req, res) {
  try {
    const { username, password } = req.body;

    let user = await UserModel.findOne({
      where: {
        username: {
          [Op.like]: "%" + username + "%",
        },
      },
    });

    if (
      user &&
      user.username == username &&
      bcrypt.compareSync(password, user.password)
    ) {
      let token = jwt.sign({ user: user }, "#Abcasdfqwr", {
        expiresIn: "7d",
      });
      res.status(201).json(
        sucess({
          token,
          user: {
            username,
            password: user.password,
          },
        })
      );
    } else {
      const msg = "Usuário ou senha inválido.";

      logger.log("info", msg);

      res.status(404).json(fail(msg));
    }
  } catch (error) {
    const msg = "Usuário ou senha inválido.";

    logger.log("info", msg);

    res.status(404).json(fail(msg));
  }
}

async function getByUsername(req, res) {
  try {
    const user = req.data;

    res.status(201).json(sucess(user));
  } catch (error) {
    const msg = "Usuário não encontrado.";

    logger.log("info", msg);

    res.status(500).json(fail(msg));
  }
}

async function getByIdUser(req, res) {
  try {
    const user = req.data;

    res.status(201).json(sucess(user));
  } catch (error) {
    const msg = "Usuário não encontrado.";

    logger.log("info", msg);

    res.status(500).json(fail(msg));
  }
}

async function createUser(req, res) {
  try {
    const { username, password } = req.body;

    password = bcrypt.hashSync(password, 8);

    const user = await UserModel.create({
      username: username,
      password: password,
      isAdmin: false,
    });

    res.status(201).json(sucess(user));
  } catch (error) {
    const msg = "Erro ao criar usuário.";

    logger.log("error", msg);

    res.status(500).json(fail(msg));
  }
}

async function createUserAdmin(req, res) {
  try {
    const { username, password } = req.body;

    const user = await UserModel.create({
      username: username,
      password: password,
      isAdmin: true,
    });

    res.status(201).json(sucess(user));
  } catch (error) {
    const msg = "Erro ao criar usuário.";

    logger.log("error", msg);

    res.status(500).json(fail(msg));
  }
}

async function updateUserById(req, res) {
  const { username, password } = req.body;

  var userRequisition = req.user;

  try {
    const user = req.data;

    if (
      parseInt(user.id) != parseInt(userRequisition.id) &&
      userRequisition.isAdmin == false
    ) {
      res
        .status(500)
        .json(
          fail(
            "Erro ao atualizar usuário. Não é possivel alterar outro usuário"
          )
        );
    } else {
      await user.update({
        username: username,
        password: bcrypt.hashSync(password, 8),
        isAdmin: user.isAdmin,
      });

      res.json({ user });
    }
  } catch (error) {
    res.status(500).json(fail("Erro ao atualizar usuário."));
  }
}

async function updateUserAdminById(req, res) {
  const { username, password, isAdmin } = req.body;

  try {
    const user = req.data;

    await user.update({
      username: username,
      password: bcrypt.hashSync(password, 8),
      isAdmin: isAdmin,
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json(fail("Erro ao atualizar usuário."));
  }
}

async function deleteUserAdminById(req, res) {
  try {
    const user = req.data;

    if (user.isAdmin == true) {
      res
        .status(500)
        .json(fail("Não é possível deletar um usuário administrador."));
    } else {
      await user.destroy();

      res.json({ user });
    }
  } catch (error) {
    res.status(500).json(fail("Erro ao deletar usuário."));
  }
}

module.exports = {
  authUser,
  createUser,
  createUserAdmin,
  getByUsername,
  getByIdUser,
  updateUserById,
  updateUserAdminById,
  deleteUserAdminById,
};
