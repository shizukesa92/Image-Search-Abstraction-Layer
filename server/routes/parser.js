const mongo = require("mongodb");
const shortid = require("shortid");
const validUrl = require("valid-url");
const dotenv = require("dotenv").config({
	path: "./.env" // .env not located in root
});

const uri = process.env.MONGOLAB_URI;

module.exports = {

	// Handles shortlink requests
	generate: (req, res) => {
		mongo.MongoClient.connect(uri, (err, db) => {
			if (err) {
				console.log("Unable to connect to server", err);
			} else {
				const database = db.db("url-shortener-microservice"); // Cannot use db.collection because of an express update. Note "..." must first be created as a database in server
				const collection = database.collection("urls"); // Note "urls" must first be created as a collection in server
				const url = req.body.url;
				const host = req.get("host") + "/api/shorturl/";

				const generateLink = (db, callback) => {
					if (validUrl.isUri(url)) { // Checks if URL is valid
						collection.findOne({
							"url": url
						}, {
							"short": 1,
							"_id": 0
						}, (err, doc) => {
							if (doc != null) {
								res.json({
									"original_url": url,
									"short_url": host + doc.short
								});
							} else {
								const shortCode = shortid.generate(); // Shortcode generator
								const newUrl = {
									url: url,
									short: shortCode
								};
								collection.insert([newUrl]);
								res.json({
									"original_url": url,
									"short_url": host + shortCode
								});
							}
						});
					} else {
						res.json({
							"error": "Invalid URL"
						});
					}
				};

				generateLink(db, () => {
					db.close();
				});
			}
		});
	},

	// Handles redirection requests
	redirect: (req, res) => {
		mongo.MongoClient.connect(uri, (err, db) => {
			const database = db.db("url-shortener-microservice");
			const collection = database.collection('urls');
			const short = req.params.short;

			collection.findOne({
				"short": short
			}, {
				"url": 1,
				"_id": 0
			}, (err, doc) => {
				if (doc != null) {
					res.redirect(doc.url);
				} else {
					res.json({
						error: "Shortlink not found in the database."
					});
				}
			});

			db.close();
		});
	}
};
