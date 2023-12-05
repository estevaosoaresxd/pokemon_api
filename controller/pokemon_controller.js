const PokemonModel = require("../model/pokemon_model");

const { sucess, fail } = require("../helpers/response");
const { addNotificationInList } = require("../helpers/websocket");
const cache = require("../helpers/cache");

const { logger } = require("../helpers/logger");

async function createPokemon(req, res) {
  try {
    let {
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

    weight = parseFloat(weight);
    height = parseFloat(height);
    hp = parseInt(hp);
    attack = parseInt(attack);
    defense = parseInt(defense);
    specialDefense = parseInt(specialDefense);
    specialAttack = parseInt(specialAttack);
    speed = parseInt(speed);
    image = Buffer.from(image, "base64");

    const pokemon = await PokemonModel.create({
      name,
      type,
      image,
      weight,
      height,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed,
    });

    await cache.del("getAllPokemons");

    addNotificationInList({
      username: req.user.username,
      message: `Uma nova fruta foi inserida por: ${req.user.username}`,
      usersListened: [],
      date: new Date(),
    });

    res.status(201).json(sucess(pokemon));
  } catch (error) {
    const msg = "Erro ao criar o pokemon";

    logger.log("error", msg);

    res.status(500).json(fail(msg));
  }
}

async function getAllPokemons(req, res) {
  var limit = req.limit;
  var page = req.page;

  try {
    const pokemonsFromCache = await cache.get("getAllPokemons");

    // if (pokemonsFromCache) {
    //   return res.json(
    //     sucess({
    //       count: pokemonsFromCache.count,
    //       pokemons: pokemonsFromCache.rows,
    //     })
    //   );
    // }

    const pokemons = await PokemonModel.findAndCountAll({
      limit: limit,
      offset: page * limit,
    });

    pokemons.rows.map((e) => {
      // e.image = e.image.toString("base64");
      e.image = "";
      return e;
    });

    await cache.set("getAllPokemons", pokemons, 60 * 5);

    res.json(sucess({ count: pokemons.count, pokemons: pokemons.rows }));
  } catch (error) {
    const msg = "Erro ao obter os pokemons";

    logger.log("error", msg);

    res.status(500).json(fail(msg));
  }
}

async function getByIdPokemon(req, res) {
  try {
    let pokemon = req.data;

    pokemon.image = pokemon.image.toString("base64");

    res.json(sucess(pokemon));
  } catch (error) {
    const msg = "Não foi possível localizar o pokemon.";

    logger.log("error", msg);

    res.status(500).json(fail(msg));
  }
}

async function getByNamePokemon(req, res) {
  try {
    let pokemon = req.data;

    pokemon.image.toString("base64");

    res.json(sucess(pokemon));
  } catch (error) {
    const msg = "Não foi possível localizar o pokemon.";

    logger.log("error", msg);

    res.status(500).json(fail("Não foi possível localizar o pokemon."));
  }
}

async function updatePokemon(req, res) {
  let {
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

  weight = parseFloat(weight);
  height = parseFloat(height);
  hp = parseInt(hp);
  attack = parseInt(attack);
  defense = parseInt(defense);
  specialDefense = parseInt(specialDefense);
  specialAttack = parseInt(specialAttack);
  speed = parseInt(speed);
  image = Buffer.from(image, "base64");

  try {
    const pokemon = req.data;

    await pokemon.update({
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
    });

    await cache.del("getAllPokemons");

    res.json({ pokemon });
  } catch (error) {
    res.status(500).json(fail("Erro ao atualizar o pokemon"));
  }
}

async function deletePokemon(req, res) {
  try {
    const pokemon = req.data;

    await pokemon.destroy();

    await cache.del("getAllPokemons");

    res.json(sucess(pokemon));
  } catch (error) {
    res.status(500).json(fail("Erro ao excluir o pokemon"));
  }
}

module.exports = {
  createPokemon,
  getAllPokemons,
  getByIdPokemon,
  getByNamePokemon,
  updatePokemon,
  deletePokemon,
};
