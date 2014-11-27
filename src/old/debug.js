/************************************
 * DEBUG CODE
 ************************************/
S4 = function() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};


guid = function(){return null;};
/*guid = function() {
	if(debug_guid == null)
	{
		chrome.storage.local.get('pvl-guid', function(items){
			debug_guid = items['pvl-guid'];
		
			if(debug_guid == null)
			{
				log("WARNING: No GUID was found in the local storage. Giving user a new GUID");
				debug_guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
				chrome.storage.local.set({'pvl-guid': debug_guid}, function(){log("New GUID Set!");});
			}
		
			log("Current user GUID: " + debug_guid);
		});
		
		while(debug_guid == null); //waits for the GUID to be made/found
		
		return debug_guid;
	}
	else
		return debug_guid;
};*/

debug = function(msg) {
	console.log("[DEBUG] "+msg);
	log_array.push("[DEBUG] "+msg);
};

log = function(msg) {
	console.log("[INFO] "+msg);
	log_array.push("[INFO] "+msg);
};