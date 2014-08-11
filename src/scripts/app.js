//The start of the Chrome Application
log("Starting Ponyville Live Desktop App v" + app_version + (app_beta ? '_BETA' : ''));

//Sets the default display width and height to make sure no problems occur
log("Fixing window dimensions");
chrome.app.window.get('pvldesktopapp').innerBounds.width = 764;
chrome.app.window.get('pvldesktopapp').innerBounds.height = 340;

//Gets the GUID set for this computer (used in anon stats)
log("Getting user GUID");
//log("Current user GUID: " + guid());

//Gets basic information about the current system
var system_stats = getStats();
debug("Application Version: " + system_stats['version']);
debug("Operating System: " + system_stats['OS']);
debug("Operating System Version: " + system_stats['OSversion']);

//Checks for jQuery as it is required by the application code
log("Checking if jQuery is loaded");
if(typeof jQuery == "undefined") {
	throw { name: 'Fatal Error!', message: 'jQuery was not loaded or could not be found!' };
}

//Injects the application version to the display on the right
log("Injecting application version into display");
$('.pvl-app-version').text(app_version + ( app_beta ? '_BETA' : ''));

//Loads click handlers for links and buttons through out the application
log("Loading button handlers");
loadButtonHandlers();

//Loads stations and streams into their respective lists
log("Loading stations and streams");
loadStationsIntoList();
