chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('main.window.html', {
		id: "pvldesktopapp",
		'bounds' : {
			'width': 800,
			'height': 600
		},
		minWidth: 800,
		minHeight: 600,
		resizable:true
	});
}); 