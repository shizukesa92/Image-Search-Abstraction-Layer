const express = require("express");
const router = express.Router();
const path = require("path");
const latest = require("../controller/latest");
const search = require("../controller/search");

module.exports = (app, db) => { // Must pass app in as argument and not just define in global scope
	router.route("/latest").get(latest);
	router.route("/:query").get(search);

	app.get("/api", (req, res) => { // NOTE: Name of route must be defined in webpack config under proxy "/api" if using dev server
		res.status(200).send(req.protocol + '://' + req.get("host"));
	});

	app.use(express.static("./dist/client")); // Use dist and not client because server renders dist

	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname + "./dist/client/index.html")); // Cannot use render for html unlike pug etc
	});


}
