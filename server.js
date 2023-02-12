// # NetCup Deployment
// if (typeof PhusionPassenger != "undefined") {
//   PhusionPassenger.configure({ autoInstall: false });
// }

const express = require("express");
const { Nuxt, Builder } = require("nuxt");

const config = require("./nuxt.config.js");

// Create new express app
const app = express();

// # NetCup Deployment
// if (typeof PhusionPassenger != "undefined") {
//   app.listen(process.env.PORT || "passenger");
// } else {
//   app.listen(process.env.PORT || 8282);
// }
// # Railway Deployment
app.listen(process.env.PORT || 5000);


// Enable production mode
config.dev = false;

config.host = process.env.HOST || "0.0.0.0";

// Create instance of nuxt
const nuxt = new Nuxt(config);

// Add nuxt middleware
app.use(nuxt.render);

// Build on start
// new Builder(nuxt).build().catch(err => {
//   console.error(err);
//   process.exit(1);
// });
