var __app_version = "0.1.2";
var __app_beta = false;

/**DEBUG CODE**/
function S4(){return (((1+Math.random())*0x10000)|0).toString(16).substring(1);}
function guid(){return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();};
var __debug_mode = true;
var __debug_guid = guid();
function __debug(msg){if(__debug_mode)console.log("[DEBUG][" + arguments.callee.caller.name +"] " + msg);}
/**************/

$(function(){_hook_app_ready()});

var _last_played_song = 0;

function _hook_app_ready() {
	__debug("***===STARTING DEBUG===***")
	__debug("Session ID: " + __debug_guid);
	__debug("System Platform: " + navigator.platform);
	__debug("System Browser: " + navigator.vendor);
	__debug("System User Agent: " + navigator.userAgent);
	__debug("App Version: " + __app_version);
	__debug("Debug Copy: " + __app_beta);
	__debug("****");
	
	__debug("App Ready, loading base system");
	__debug("Adding version to app title bar");
	$('.pvl-app-version').text(__app_version + (__app_beta ? '_BETA' : ''));
	__debug("Loading stations");
	pvl_load_stations();
	__debug("Hooking buttons");
	pvl_hook_buttons();
}

function pvl_hook_buttons()
{    	
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
        __debug("Volume Changed [" + volume * 100 + "%]");   
    });
    
    $('.pause').click(function(event){
    	event.preventDefault();
    	$('.station_list .station').each(function(index){ $(this).removeClass('playing'); $(this).find('audio')[0].pause(); });
    	__debug("Station Playback Stoped");
    });
    
    $('.mute').click(function(event){
    	event.preventDefault();
    	$('li[id^="station_"] > audio').each(function(index, element){ this.volume = 0; });
    	$('.volume-bar-value').css('width', '0%');
    	__debug("Volume Changed [MUTE]");  
    });
    
    $('.volume-max').click(function(event){
    	event.preventDefault();
    	$('li[id^="station_"] > audio').each(function(index, element){ this.volume = 1; });
    	$('.volume-bar-value').css('width', '100%');
    	__debug("Volume Changed [MAX]");   
    });
    
    
	$('.vote a').click(function(event){
    	event.preventDefault();
    	
    	if($(this).hasClass('vote-down') && !$(this).hasClass('selected'))
    	{
    		_vote_type = "dislike";
    		$('.display .controls .vote .nowplaying-score').text(Number($('.display .controls .vote .nowplaying-score').attr('data-orginal')) - 1);
    		$('.display .controls .vote .vote-up').removeClass('selected');
    	}
    	else if($(this).hasClass('vote-up') && !$(this).hasClass('selected'))
    	{
    		_vote_type = "like";
    		$('.display .controls .vote .nowplaying-score').text(Number($('.display .controls .vote .nowplaying-score').attr('data-orginal')) + 1);
    		$('.display .controls .vote .vote-down').removeClass('selected');
    	}
    	else if($(this).hasClass('selected'))
    	{
    		_vote_type = "clearvote";
    		$('.display .controls .vote .nowplaying-score').text(Number($('.display .controls .vote .nowplaying-score').attr('data-orginal')));
    	}
    	
    	$(this).toggleClass('selected');
    		
    	_song_id = $('.display .controls .vote .nowplaying-score').attr('data-id');
    	
    	$.post( "http://ponyvillelive.com/api/song/"+_vote_type+"/sh_id/"+_song_id, function(data) {
			__debug("Song Vote ["+_vote_type+"] - Response ["+data.status+"]");
			console.log(data);
		});
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
		
		$('.station_list .station').click(function(event){
			if($(this).hasClass("offline"))
				return;
				
			if($(this).hasClass('playing'))
			{
				$('#container > .display').fadeOut();
				$('#background > #welcome-message').fadeIn();
				$('#background > #mascot').fadeIn();
				$('#background > #logotype').fadeIn();
				$('.station_list .station').each(function(index){ $(this).removeClass('playing'); $(this).find('audio')[0].pause(); });
				$('.display > .station').attr('data-station-id', 0);
			}
			else
			{
				$('.station_list .station').each(function(index){ $(this).removeClass('playing'); $(this).find('audio')[0].pause(); });
				$('#background > #welcome-message').fadeOut();
				$('#background > #mascot').fadeOut();
				$('#background > #logotype').fadeOut();
				
				$(this).addClass('playing');
				$('.display > .station').attr('data-station-id', $(this).attr('data-id'));
				$(this).find('audio')[0].load();
				$(this).find('audio')[0].play();
				
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
					continue;
				if($('li[id="station_'+data.code+'"]') == 0)
					continue;
				
				if(station_data.listeners == null)
				{
					$('li[id="station_'+station_data.code+'"]').addClass("offline");
					$('li[id="station_'+station_data.code+'"] > h4 > .nowplaying-info > .nowplaying-listeners').html('<i class="fa fa-user"></i>&nbsp;Offline');
					$('li[id="station_'+station_data.code+'"] > .nowplaying-song').text("Station Offline");
					continue;
				}
				else 
					$('li[id="station_'+station_data.code+'"]').removeClass("offline");
				
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
				
				
				if(station_data.id == $('.display > .station').attr('data-station-id'))
				{
					$('.display > .station > img').attr('src', $('li[id="station_'+station_data.code+'"] > img').attr('src'));
					
					$('.display > .station > .info > h1').text(station_data.name);
					$('.display > .station > .info > h1').append('<span class="nowplaying-info"><span class="nowplaying-listeners"></span></span>');
					$('.display > .station > .info > .genre-info').text(station_data.genre);
					
					$('#container > .display > .nowplaying > .panel-top > h4 > .nowplaying-station-listeners').text(station_data.listeners + ' Listeners Tuned In');
					
					if(_last_played_song != station_data.song_sh_id)
					{
						$('.display > .nowplaying > .nowplaying-info > .nowplaying-song').text(station_data.title);
						$('.display > .nowplaying > .nowplaying-info > .nowplaying-song').attr('title', station_data.title);
						
						$('.display > .nowplaying > .nowplaying-info > .nowplaying-artist').text(station_data.artist);
						$('.display > .nowplaying > .nowplaying-info > .nowplaying-artist').attr('title', station_data.artist);
						
						$('.display .controls .vote .nowplaying-score').attr('data-id', station_data.song_sh_id);
						$('.display .controls .vote .nowplaying-score').attr('data-orginal', station_data.song_score);
						$('.display .controls .vote .nowplaying-score').text(station_data.song_score);
						
						_last_played_song = station_data.song_sh_id;
						
						if(station_data.song_external != null && station_data.song_external.bronytunes != null && station_data.song_external.bronytunes.image_url != null)
							notify(station_data.logo, station_data.name, station_data.text, station_data.song_external.bronytunes.image_url);
						else
							notify(station_data.logo, station_data.name, station_data.text, null);
					}
				}
            }
	});	
	
	$(".select_bar").fadeIn();
}

function notify(image, notification_title, description, song_image)
{
	__debug("Notify Called");
	var opt = {
		type : "basic",
		title: notification_title,
		message: description,
	}
	
	opt.priority = 2;
	
	__debug("Converting image [" + image + "] to blob")
	var xhr = new XMLHttpRequest();
	xhr.open("GET", image);
	xhr.responseType = "blob";
	xhr.onload = function(){
    	var blob = this.response;
    	opt.iconUrl = window.URL.createObjectURL(blob);
    	
    	if(song_image != null)
    		notify_image(opt, song_image);
    	else
    		chrome.notifications.create("id" + _last_played_song, opt, creationCallback);
	};
	xhr.send(null);
}

function notify_image(opt, song_image)
{
	__debug("Notify Image Called");
	opt.type = "image";
	
	__debug("Converting image [" + song_image + "] to blob")
	var xhr = new XMLHttpRequest();
	xhr.open("GET", song_image);
	xhr.responseType = "blob";
	xhr.onload = function(){
    	var blob = this.response;
    	opt.imageUrl = window.URL.createObjectURL(blob);
    	chrome.notifications.create("id" + _last_played_song, opt, creationCallback);
	};
	xhr.send(null);
}

function creationCallback(notID) {
	__debug("Succesfully created " + notID + " notification");
	if (document.getElementById("clear").checked) {
		setTimeout(function() {
			chrome.notifications.clear(notID, function(wasCleared) {
				__debug("Notification " + notID + " cleared: " + wasCleared);
			});
		}, 1500);
	}
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
