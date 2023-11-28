const { fail } = require("../helpers/response");

const { Op } = require("sequelize");

const PokemonModel = require("../model/pokemon_model");

async function validId(req, res, next) {
  let id = parseInt(req.params.id);

  if (id != id || id < 1) {
    res.status(500).json(fail("Por favor digite um ID Válido."));
    return;
  }

  const pokemon = await PokemonModel.findByPk(id);

  if (pokemon) {
    req.data = pokemon;
    return next();
  }

  res.status(404).json(fail("Pokemon não encontrado"));
}

function verifyAllData(req, res, next) {
  const { name, quantity, unity, recipeId } = req.body;

  if (
    name != undefined &&
    quantity != undefined &&
    unity != undefined &&
    recipeId != undefined
  ) {
    next();
  } else {
    res
      .status(500)
      .json(fail("Por favor envie todos os dados do ingrediente."));
  }
}

async function validName(req, res, next) {
  let name = req.params.name;

  if (!name) {
    res.status(500).json(fail("Por favor digite um nome de pokemon válido."));
    return;
  }

  const pokemon = await PokemonModel.findOne({
    where: {
      name: {
        [Op.like]: "%" + name + "%",
      },
    },
  });

  if (pokemon) {
    req.data = pokemon;
    return next();
  }

  res.status(404).json(fail("Pokemon não encontrado"));
}

module.exports = {
  validId,
  verifyAllData,
  validName,
};
