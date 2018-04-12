module.exports = (req, res) => {
	const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.KEY}&searchType=image&fields=items(htmlTitle,link,snippet,image/contextLink,image/thumbnailLink)&prettyPrint=false&cx=${process.env.SEARCHID}&q=`
	var startIndex = 1;
	var searchTerm = req.params.query;
	var date = new Date();

	if (req.query.offset) {
		startIndex = req.query.offset * 10
		console.log(startIndex)
		// console.log(`${url}${searchTerm}&start=${startIndex}`)
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


};
