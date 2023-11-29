const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const PokemonModel = sequelize.define(
  "PokemonModel",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
    height: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    attack: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    defense: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    specialAttack: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    specialDefense: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    speed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { tableName: "pokemons" }
);

module.exports = PokemonModel;
