var __app_version = "0.0.1_DEV-BETA";

/**DEBUG CODE**/
function S4(){return (((1+Math.random())*0x10000)|0).toString(16).substring(1);}
function guid(){return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();};
var __debug_mode = true;
var __debug_guid = guid();
function __debug(msg){if(__debug_mode)console.log("[DEBUG][" + arguments.callee.caller.name +"] " + msg);}
/**************/

$(function(){_hook_app_ready()});


function _hook_app_ready() {
	__debug("***===STARTING DEBUG===***")
	__debug("Session ID: " + __debug_guid);
	__debug("System Platform: " + navigator.platform);
	__debug("System Browser: " + navigator.vendor);
	__debug("System User Agent: " + navigator.userAgent);
	__debug("****");
	
	__debug("App Ready, loading base system");
	__debug("Adding version to app title bar");
	$('.pvl-app-version').text(__app_version);
	__debug("Loading stations");
	pvl_load_stations();
	__debug("Hooking buttons");
	pvl_hook_buttons();
}

function pvl_hook_buttons()
{    
    $('.exit').click(function(event){
    	window.close();
    });
    
    $('.minimize').click(function(event){
    	chrome.app.window.current().minimize();
    });
	
	$('.app-error .app-error-dismiss').click(function(event){
		if($(this).hasClass('btn-disabled'))
    		return;
    	$('.app-error').fadeOut();
		$('#container').fadeIn();
	});
	
	$('.volume-bar').click(function (e) {
		var posX = $(this).offset().left,
		volume = (e.pageX - posX) / $(this).width();
		
		$('li[id^="station_"] > audio').each(function(index, element){ this.volume = volume; });
		
        $('.volume-bar-value').css('width', volume * 100 + '%');  
        __debug("Volume Changed [" + volume * 100 + "%]")   
    });
    
    $('.mute').click(function(event){
    	event.preventDefault();
    	$('li[id^="station_"] > audio').each(function(index, element){ this.volume = 0; });
    	$('.volume-bar-value').css('width', '0%');
    	__debug("Volume Changed [MUTE]")   
    });
    
    $('.volume-max').click(function(event){
    	event.preventDefault();
    	$('li[id^="station_"] > audio').each(function(index, element){ this.volume = 1; });
    	$('.volume-bar-value').css('width', '100%');
    	__debug("Volume Changed [MAX]")   
    });
	
	
    __debug("Button hooks loaded!");
}

function pvl_load_stations()
{
	$.getJSON('http://ponyvillelive.com/api/station/list/category/audio/client/pvldesktopapp/guid/'+__debug_guid, function(data){
		if(data.status != "success") {
			__debug("Whoops! I failed to get data from PVL! Please check your internet connection and try again");
			__debug("[REQUEST] " + 'http://ponyvillelive.com/api/station/list');
			__debug("[STATUS] " + data.status);
			__debug("[RESULT] " + data.error);
			__debug("[SESSION] " + __debug_guid);
			
			pvl_error("Failed to connect to PVL!", "Please check your internet and try again. " + 
			__debug_guid+":"+data.status+":"+data.error, false);
			return;
		}
		
		data.result.forEach(function(station){
		if(station.category == "audio") {
			$(".station_list").append('<li class="station" id="station_'+station.shortcode+'" data-id="'+station.id+'" data-name="'+station.name+'"></li>');
			
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function() {
				$('li[id="station_'+station.shortcode+'"]').append('<img src="'+window.URL.createObjectURL(xhr.response)+'">');
				
				$('li[id="station_'+station.shortcode+'"]').append('<h4>'+station.name+'</h4>');
				$('li[id="station_'+station.shortcode+'"] > h4').append('<span class="nowplaying-info"><span class="nowplaying-listeners"></span></span>');
				$('li[id="station_'+station.shortcode+'"]').append('<p class="genre-info">'+station.genre+'</p>');
				
				$('li[id="station_'+station.shortcode+'"]').append('<p class="nowplaying-onair"><span class="nowplaying-onair-inner"></span></p>');
				$('li[id="station_'+station.shortcode+'"]').append('<p class="nowplaying-song"></p>');
				$('li[id="station_'+station.shortcode+'"]').append('<p class="nowplaying-artist"></p>');
				$('li[id="station_'+station.shortcode+'"]').append('<audio style="display: none;" preload="none" src="'+station.stream_url+'"></audio>');
			}
			xhr.open('GET', station.image_url, true);
			xhr.send();		
		}});
		
		pvl_update_stations();
		
		$('.station').click(function(event){
			if($(this).hasClass('playing'))
			{
				$('#container > .display').fadeOut();
				$('#background > #welcome-message').fadeIn();
				$('#background > #mascot').fadeIn();
				$('.station').each(function(index){ $(this).removeClass('playing'); $(this).find('audio')[0].pause(); });
			}
			else
			{
				$('.station').each(function(index){ $(this).removeClass('playing'); $(this).find('audio')[0].pause(); });
				$('#background > #welcome-message').fadeOut();
				$('#background > #mascot').fadeOut();
				
				$(this).addClass('playing');
				$(this).find('audio')[0].load();
				$(this).find('audio')[0].play();
				
				$('#container > .display > .nowplaying > .panel-top > h4 > .nowplaying-station-name').text($(this).data('name'));
				
				$('#container > .display').fadeIn();
				pvl_update_stations();
			}
		});
	});
	
	setInterval(function(){pvl_update_stations();}, 30000);
	
	__debug("Stations loaded");
}

function pvl_update_stations()
{
	$.getJSON('http://ponyvillelive.com/static/api/nowplaying.json', function(data){
			if(data == null) {
				__debug("Whoops! I failed to get data from PVL! Please check your internet connection and try again");
				__debug("[REQUEST] " + 'http://ponyvillelive.com/static/api/nowplaying.json');
				__debug("[RESULT] " + data);
				__debug("[SESSION] " + __debug_guid);
				
				pvl_error("Failed to connect to PVL!", "Please check your internet and try again. " + 
				__debug_guid+":"+data.status+":"+data.error, false);
				return;
			}
			
			for(station_id in data)
			{
			   station_data = data[station_id];
               if(station_data.category != "audio")
					return;
				if($('li[id="station_'+data.code+'"]') == 0)
					return;
					
				$('li[id="station_'+station_data.code+'"] > h4 > .nowplaying-info > .nowplaying-listeners').html('<i class="fa fa-user"></i>&nbsp;'+station_data.listeners);
				$('li[id="station_'+station_data.code+'"] > h4 > .nowplaying-info > .nowplaying-listeners').attr('title', station_data.listeners+' Listeners')
				
				$('li[id="station_'+station_data.code+'"] > .nowplaying-song').text(station_data.title);
				$('li[id="station_'+station_data.code+'"] > .nowplaying-song').attr('title', station_data.title);				
				
				$('li[id="station_'+station_data.code+'"] > .nowplaying-artist').text(station_data.artist);
				$('li[id="station_'+station_data.code+'"] > .nowplaying-artist').attr('title', station_data.artist);
				
				if(station_data.event != null)
				{
					$('li[id="station_'+station_data.code+'"]').addClass('live');
					$('li[id="station_'+station_data.code+'"] > .nowplaying-onair > .nowplaying-onair-inner').html('<i class="fa fa-star"></i>&nbsp;'+station_data.event.title);
					$('li[id="station_'+station_data.code+'"] > .nowplaying-onair > .nowplaying-onair-inner').attr('title', station_data.event.title);
					$('li[id="station_'+station_data.code+'"] > .nowplaying-onair > .nowplaying-onair-inner').fadeIn();
				}
				else
				{
					$('li[id="station_'+station_data.code+'"]').removeClass('live');
					$('li[id="station_'+station_data.code+'"] > .nowplaying-onair > .nowplaying-onair-inner').fadeOut();
				}
				
				
				if($('li[id="station_'+station_data.code+'"]').hasClass("playing"))
				{
					$('.display > .nowplaying > .nowplaying-info > .nowplaying-song').text(station_data.title);
					$('.display > .nowplaying > .nowplaying-info > .nowplaying-song').attr('title', station_data.title);
					
					$('.display > .nowplaying > .nowplaying-info > .nowplaying-artist').text(station_data.artist);
					$('.display > .nowplaying > .nowplaying-info > .nowplaying-artist').attr('title', station_data.artist);
				}
            }
	});	
	
	$(".select_bar").fadeIn();
}

function pvl_error(title, message, continue_allowed)
{
	__debug("ERROR THROWN["+title+"]: "+message)
	$('#container').fadeOut();
	
	$('.app-error .app-error-title').text(title);
	$('.app-error .app-error-body').text(message);
	continue_allowed ? $('.app-error .app-error-dismiss').fadeIn() : $('.app-error .app-error-dismiss').fadeOut();
	
	$('.app-error').fadeIn();
}
