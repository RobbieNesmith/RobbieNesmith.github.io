function postToServer() {
	var titleEl = document.getElementById("title");
	var descriptionEl = document.getElementById("description");
	var requestLog = document.getElementById("requestLog");
	var request = document.createElement("div");
	request.className = "request";
	request.innerText = "Title: " + titleEl.value + "\nDescription: " + descriptionEl.value;
	requestLog.appendChild(request);

	var formData = new FormData();
	formData.append("title", titleEl.value);
	formData.append("description", descriptionEl.value);
	fetch("https://robbies-dumb-server.herokuapp.com/create", {
		method: "POST",
		body: formData
	})
		.then(res => res.text())
		.then(text => {
			console.log(text);
			titleEl.value = "";
			descriptionEl.value = "";
			request.className = "request sent";
		});
}

function getFromServer() {
	fetch("https://robbies-dumb-server.herokuapp.com/list")
		.then(res => res.text())
		.then(text => {
			document.getElementById("loadingContent").style.display="none";
			document.getElementById("resultContent").style.display="initial";
			document.getElementById("resultContent").innerText = text;
		});
}
