const { Op } = require("sequelize");

const UserModel = require("../model/user_model");
const { sucess, fail } = require("../helpers/response");

const jwt = require("jsonwebtoken");

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

    if (user && user.username == username && user.password == password) {
      let token = jwt.sign({ user: user }, "#Abcasdfqwr", {
        expiresIn: "50 min",
      });
      res.status(201).json(
        sucess({
          token,
          user: {
            username,
            password,
          },
        })
      );
    } else {
      res.status(404).json(fail("Usuário ou senha inválido."));
    }
  } catch (error) {
    res.status(404).json(fail("Usuário ou senha inválido."));
  }
}

async function getByUsername(req, res) {
  try {
    const user = req.data;

    res.status(201).json(sucess(user));
  } catch (error) {
    res.status(500).json(fail("Usuário não encontrado."));
  }
}

async function getByIdUser(req, res) {
  try {
    const user = req.data;

    res.status(201).json(sucess(user));
  } catch (error) {
    res.status(500).json(fail("Usuário não encontrado."));
  }
}

async function createUser(req, res) {
  try {
    const { username, password } = req.body;

    const user = await UserModel.create({
      username: username,
      password: password,
      isAdmin: false,
    });

    res.status(201).json(sucess(user));
  } catch (error) {
    res.status(500).json(fail("Erro ao criar usuário."));
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
    res.status(500).json(fail("Erro ao criar usuário."));
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
        password: password,
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
      password: password,
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
