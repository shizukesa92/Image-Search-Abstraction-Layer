const express = require("express");
const path = require("path");
const api = require("./server/routes/api");
const bodyParser = require("body-parser"); // Must be required in earliest server file and not in later ones

const app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/api", api); // Mandatory for template variables to work
app.use("/api/shorturl", api);

app.use(express.static("./dist/client")); // Use dist and not client because server renders dist

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "./dist/client/index.html")); // Cannot use render for html unlike pug etc
});

app.listen(process.env.PORT || 3000); // Must use process.env.PORT because heroku and other cloud hosts may not use port 3000

// heroku config:set MONGOLAB_URI=mongodb://<dbuser>:<dbpassword>@ds237989.mlab.com:37989/url-shortener-microservice
