const express = require("express");
const parser = require("./parser");

const router = express.Router();

router.route("/new/").post(parser.generate);
router.route("/:short").get(parser.redirect);

router.get("/", (req, res) => {
	res.status(200).send(req.protocol + '://' + req.get("host"));
});

module.exports = router; // Cannot use ES6 syntax (i.e. export default)
