const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

const mainRoute = require("./routes/main_route");
const pokemonRoute = require("./routes/pokemon_route");
const installRoute = require("./routes/install_route");
const userRoute = require("./routes/user_route");

app.use("/", mainRoute);
app.use("/pokemon", pokemonRoute);
app.use("/install", installRoute);
app.use("/user", userRoute);

const startup = async () => {
  app.listen(process.env.PORT, () => {
    console.log("Listenning...");
  });
};

startup();
