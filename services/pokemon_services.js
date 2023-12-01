const { fail } = require("../helpers/response");

const { Op } = require("sequelize");

const PokemonModel = require("../model/pokemon_model");
const { sendPusblish } = require("../helpers/rabbitmq");

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
  const {
    name,
    type,
    image,
    weight,
    height,
    hp,
    attack,
    defense,
    specialDefense,
    specialAttack,
    speed,
  } = req.body;

  if (
    name != undefined &&
    type != undefined &&
    image != undefined &&
    weight != undefined &&
    height != undefined &&
    hp != undefined &&
    attack != undefined &&
    defense != undefined &&
    specialDefense != undefined &&
    specialAttack != undefined &&
    speed != undefined
  ) {
    next();
  } else {
    res.status(500).json(fail("Por favor envie todos os dados do pokemon."));
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

  const document = {
    date: new Date(),
    action: `getByName: ${name}`,
    actorId: req.user.id,
    actorUsername: req.user.username,
  };

  sendPusblish("SystemLog", "search_pokemons_log", JSON.stringify(document));

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
