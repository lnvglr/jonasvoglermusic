

const express = require("express");
const { Nuxt, Builder } = require("nuxt");

const config = require("./nuxt.config.js");

// Create new express app
const app = express();

if (process.env.RAILWAY !== "TRUE" && typeof PhusionPassenger != "undefined") {
	PhusionPassenger.configure({ autoInstall: false });
	app.listen(process.env.PORT || "passenger");
} else {
	app.listen(process.env.PORT || 3000);
}


// Enable production mode
config.dev = false;

config.host = process.env.HOST || "0.0.0.0";

// Create instance of nuxt
const nuxt = new Nuxt(config);

// Add nuxt middleware
app.use(nuxt.render);

// Build on start
new Builder(nuxt).build().catch(err => {
  console.error(err);
  process.exit(1);
});
