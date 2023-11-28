const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const mainRoute = require("./routes/main_route");
const pokemonRoute = require("./routes/pokemon_route");
const installRoute = require("./routes/install_route");
const userRoute = require("./routes/user_route");

app.use("/", mainRoute);
app.use("/pokemon", pokemonRoute);
app.use("/install", installRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Listenning...");
});
