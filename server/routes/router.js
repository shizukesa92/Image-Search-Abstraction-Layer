const express = require("express");
const path = require("path");
const request = require("request");

module.exports = (app, db) => { // Must pass app in as argument and not just define in global scope

	const database = db.db("image-search-abstraction-layer-fcc"),
		collection = database.collection("images");

	app.get("/search/:search", (req, res) => {
		const url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCqlMaAya6CnhDtIvnZTeGIUNWKKLHPMo0&searchType=image&fields=items(htmlTitle,link,snippet,image/contextLink,image/thumbnailLink)&cx=000561780369073625013:42m_h7r79sy&q=",
			term = req.params.search,
			date = new Date();
		let index = 1;

		if (req.query.offset) {
			index = req.query.offset * 10;
			if (index > 10) index = 1;
		}
		request(`${url}${term}&start=${index}`, (err, response, body) => {
			const data = JSON.parse(body);
			if (err) throw err;
			if (response.statusCode === 200) {
				res.send(data)
			}
		})

		collection.insert({
			"term": term,
			"when": date
		})

	});


	app.get("/latest", (req, res) => {
		collection.find().toArray((err, data) => {
			if (err) throw err;
			res.send(data);
		});
	});

	app.get("/api", (req, res) => { // NOTE: Name of route must be defined in webpack config under proxy "/api" if using dev server
		res.status(200).send(req.protocol + '://' + req.get("host"));
	});

	app.use(express.static("./dist/client")); // Use dist and not client because server renders dist

	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname + "./dist/client/index.html")); // Cannot use render for html unlike pug etc
	});


};
