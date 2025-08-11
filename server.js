

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
// Long-cache hashed build assets under /public
app.use((req, res, next) => {
  try {
    if (req.url && req.url.startsWith('/public/')) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
  } catch (_) {}
  next();
});
app.use(nuxt.render);

// Build on start
new Builder(nuxt).build().catch(err => {
  console.error(err);
  process.exit(1);
});
