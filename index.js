const express = require("express");
const path = require("path");
const cors = require("cors");
const redis = require("redis");
require("dotenv").config();

const app = express();

// const client = redis.createClient();
// client.connect();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
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
