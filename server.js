if (typeof PhusionPassenger != "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const express = require("express");
const { Nuxt, Builder } = require("nuxt");

const config = require("./nuxt.config.js");

// Create new express app
const app = express();

app.listen(process.env.PORT || 5000);
// if (typeof PhusionPassenger != "undefined") {
//   app.listen(process.env.PORT || "passenger");
// } else {
//   app.listen(process.env.PORT || 8282);
// }

// Enable production mode
config.dev = false;

// Create instance of nuxt
const nuxt = new Nuxt(config);

// Add nuxt middleware
app.use(nuxt.render);

// Build on start
// new Builder(nuxt).build().catch(err => {
//   console.error(err);
//   process.exit(1);
// });
