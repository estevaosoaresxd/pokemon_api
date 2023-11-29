const { Op } = require("sequelize");

const PokemonModel = require("../model/pokemon_model");

const { sucess, fail } = require("../helpers/response");

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

    res.status(201).json(sucess(pokemon));
  } catch (error) {
    res.status(500).json(fail("Erro ao criar o pokemon"));
  }
}

async function getAllPokemons(req, res) {
  var limit = req.limit;
  var page = req.page;

  try {
    const pokemons = await PokemonModel.findAndCountAll({
      limit: limit,
      offset: page * limit,
    });

    pokemons.rows.map((e) => {
      e.image = e.image.toString("base64");

      return e;
    });

    res.json(sucess({ count: pokemons.count, pokemons: pokemons.rows }));
  } catch (error) {
    res.status(500).json(fail("Erro ao obter os pokemons"));
  }
}

async function getByIdPokemon(req, res) {
  try {
    let pokemon = req.data;

    pokemon.image = pokemon.image.toString("base64");

    res.json(sucess(pokemon));
  } catch (error) {
    res.status(500).json(fail("Não foi possível localizar o pokemon."));
  }
}

async function getByNamePokemon(req, res) {
  try {
    let pokemon = req.data;

    pokemon.image.toString("base64");

    res.json(sucess(pokemon));
  } catch (error) {
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
