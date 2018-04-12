const express = require("express");
const app = express();
const route = require("./server/routes/router");
const mongo = require("mongodb").MongoClient;
const dotenv = require("dotenv").config();
const uri = process.env.MONGOLAB_URI;

mongo.connect(uri, (err, db) => {
	if (err) {
		console.log("Unable to connect to server", err);
	} else {
		console.log("connected");
		route(app, db);
	}
});

app.listen(process.env.PORT || 3000); // Must use process.env.PORT because heroku and other cloud hosts may not use port 3000

// create app and heroku config:set MONGOLAB_URI=mongodb://<dbuser>:<dbpassword>@ds237989.mlab.com:37989/url-shortener-microservice
