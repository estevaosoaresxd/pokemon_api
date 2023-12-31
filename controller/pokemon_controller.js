const PokemonModel = require("../model/pokemon_model");

const { sucess, fail } = require("../helpers/response");

const { addNotificationInList } = require("../helpers/websocket");

const { logger } = require("../helpers/logger");

const cache = require("../helpers/cache");

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
    image = await fetch(image).then(async (response) => {
      let myBlobImg = await response.blob();

      return Buffer.from(await myBlobImg.arrayBuffer());
    });

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

    addNotificationInList({
      username: req.user.username,
      message: `Um novo pokémon ${name} foi inserido por: ${req.user.username}`,
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
  const cacheKey = req.originalUrl.split("?");

  try {
    const pokemonsFromCache = await cache.get(cacheKey[0]);

    if (pokemonsFromCache) {
      return res.json(
        sucess({
          count: pokemonsFromCache.count,
          pokemons: pokemonsFromCache.rows,
        })
      );
    }

    const pokemons = await PokemonModel.findAndCountAll({
      limit: limit,
      offset: page * limit,
    });

    pokemons.rows.map((e) => {
      let imgBase64 = Buffer.from(e.image).toString("base64");
      e.image = `data:image/jpeg;base64,${imgBase64}`;
      return e;
    });

    await cache.set(cacheKey[0], pokemons, 60 * 5);

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

    res.json({ pokemon });
  } catch (error) {
    res.status(500).json(fail("Erro ao atualizar o pokemon"));
  }
}

async function deletePokemon(req, res) {
  try {
    const pokemon = req.data;

    await pokemon.destroy();

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
