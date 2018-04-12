const express = require("express");
const path = require("path");
const router = express.Router();
const request = require("request");
module.exports = (app, db) => { // Must pass app in as argument and not just define in global scope

	const database = db.db("image-search-abstraction-layer-fcc"),
		collection = database.collection("images");
	app.get("/search/:search", (req, res) => {
		const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyCqlMaAya6CnhDtIvnZTeGIUNWKKLHPMo0&searchType=image&fields=items(htmlTitle,link,snippet,image/contextLink,image/thumbnailLink)&prettyPrint=false&cx=${process.env.SEARCHID}&q=`
		var startIndex = 1;
		var searchTerm = req.params.query;
		var date = new Date();

		if (req.query.offset) {
			startIndex = req.query.offset * 10
			console.log(startIndex)
		}
		request(`${url}${searchTerm}&start=${startIndex}`, function(error, response, body) {
			var data = JSON.parse(body)
			if (error) {
				console.log('error', error); //print Error
				res.send(error)
			}
			if (response.statusCode === 200) {
				res.send(data)
			}
		})

		collection.insert({
			"term": searchTerm,
			"when": date
		})

	});


	app.get("/latest", (req, res) => {

			collection.find().toArray(function(err, items) {
				if (err) throw err

				res.send(items)
			})
		}

	);
	app.get("/api", (req, res) => { // NOTE: Name of route must be defined in webpack config under proxy "/api" if using dev server
		res.status(200).send(req.protocol + '://' + req.get("host"));
	});

	app.use(express.static("./dist/client")); // Use dist and not client because server renders dist

	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname + "./dist/client/index.html")); // Cannot use render for html unlike pug etc
	});


}
