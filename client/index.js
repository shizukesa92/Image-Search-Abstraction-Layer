const request = new XMLHttpRequest();
request.open("GET", "/api", true);

request.onload = () => {
	if (request.status >= 200 && request.status < 400) {

		const x = document.getElementsByClassName("hostURL");
		for (let i = 0; i < x.length; i++) {
			x[i].innerText = request.responseText;
		}
	} else {
		console.log("Server returned error!");
	}
};

request.onerror = () => {
	console.log("Request error!");
};

request.send();
