chrome.commands.onCommand.addListener(function (command) {
	console.log(command);
    if (command === "save") {
        alert("save");
    } else if (command === "random") {
        alert("random");
    }else if (command === "right") {
        //document.querySelector("#fbar > div > div > div > span").innerText='台台';
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
		console.log(response);
	});
	});
    }
});




chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("localpage.html") });
});