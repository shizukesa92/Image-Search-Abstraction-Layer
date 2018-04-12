module.exports = (req, res) => {

	collection.find().toArray(function(err, items) {
		if (err) throw err

		res.send(items)
	})

};
