const { Op } = require("sequelize");

const PokemonModel = require("../model/pokemon_model");

const { sucess, fail } = require("../helpers/response");

async function createPokemon(req, res) {
  try {
    var { name, recipeId, quantity, unity } = req.body;

    quantity = parseInt(quantity);

    if (!unity) {
      unity = "UN";
    }

    if (!quantity) {
      quantity = 0;
    }

    const ingredient = await PokemonModel.create({
      name,
      quantity,
      unity,
      recipeId,
    });

    res.status(201).json(sucess(ingredient));
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

    res.json(sucess(pokemons.rows));
  } catch (error) {
    res.status(500).json(fail("Erro ao obter os pokemons"));
  }
}

async function getByIdPokemon(req, res) {
  try {
    const pokemon = req.data;

    res.json(sucess(pokemon));
  } catch (error) {
    res.status(500).json(fail("Não foi possível localizar o pokemon."));
  }
}

async function getByNamePokemon(req, res) {
  try {
    const pokemon = req.data;

    res.json(sucess(pokemon));
  } catch (error) {
    res.status(500).json(fail("Não foi possível localizar o pokemon."));
  }
}

async function updatePokemon(req, res) {
  const { name, recipeId, quantity, unity } = req.body;

  quantity = parseInt(quantity);

  try {
    const pokemon = req.data;

    await pokemon.update({ name, quantity, unity, recipeId });

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
