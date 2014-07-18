chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('main.window.html', {
		id: "pvldesktopapp",
		'bounds' : {
			'width' : 764,
			'height' : 340
		},
		"resizable":false,
	});
}); 