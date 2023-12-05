const express = require("express");
const router = express.Router();

const AuthServices = require("../services/auth_services");
const PaginationServices = require("../services/pagination_services");
const PokemonServices = require("../services/pokemon_services");
const PokemonController = require("../controller/pokemon_controller");
const RedisServices = require("../services/redis_services");

router.get(
  "/",
  // AuthServices.validateToken,
  PaginationServices.setPagination,
  PokemonController.getAllPokemons
);

router.get(
  "/:id",
  AuthServices.validateToken,
  PokemonServices.validId,
  PokemonController.getByIdPokemon
);

router.get(
  "/name/:name",
  AuthServices.validateToken,
  PokemonServices.validName,
  PokemonController.getByNamePokemon
);

router.post(
  "/",
  AuthServices.validateToken,
  PokemonServices.verifyAllData,
  RedisServices.invalidateCache,
  PokemonController.createPokemon
);

router.put(
  "/:id",
  AuthServices.validateToken,
  PokemonServices.validId,
  PokemonServices.verifyAllData,
  RedisServices.invalidateCache,
  PokemonController.updatePokemon
);

router.delete(
  "/:id",
  AuthServices.validateToken,
  PokemonServices.validId,
  RedisServices.invalidateCache,
  PokemonController.deletePokemon
);

module.exports = router;
