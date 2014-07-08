var __app_version = "0.0.1_RELEASE";
var _global_int_var = 0;
var _global_sid = 0;
var _last_played_song = 0;
var vote_ratelimit = false;

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
	__debug("_hook: Adding version to app title bar");
	$('.pvl-app-version').text(__app_version);
	__debug("_hook: hooking buttons");
	pvl_hook_buttons();
	__debug("_hook: loading stations");
	pvl_load_stations();
}

function pvl_hook_buttons()
{
	$('#pvl-station_select_form > .pvl-tunein').click(function(event) {
		event.preventDefault();
		var station_id = $('#pvl-station_select_form > #pvl-station_selector').val();
		__debug("`Tune In` clicked, loading station [" + station_id + "]")
		if(station_id != null) {
			$('.start_box').fadeOut("slow");
			_global_sid = station_id;
			pvl_display_station();
			_global_int_var = window.setInterval(function(){pvl_display_station()}, 15000);
			pvl_play_station();
			$('#background').fadeTo("slow", 1);
			$('.play_box').fadeIn("slow");
		}
	});
	
	$('.jp-volume-bar').click(function (e) {
		var posX = $(this).offset().left,
		volume = (e.pageX - posX) / $(this).width();
		
		$('*[id^="pvl-station-stream_"]').each(function(index, element){ this.volume = volume; });
		
        $('.jp-volume-bar-value').css('width', volume * 100 + '%');  
        __debug("Volume Changed [" + volume * 100 + "%]")   
    });
    
    $('.jp-mute').click(function(event){
    	event.preventDefault();
    	$('*[id^="pvl-station-stream_"]').each(function(index, element){ this.volume = 0; });
    	$('.jp-volume-bar-value').css('width', '0%');
    	__debug("Volume Changed [MUTE]")   
    });
    
    $('.jp-volume-max').click(function(event){
    	event.preventDefault();
    	$('*[id^="pvl-station-stream_"]').each(function(index, element){ this.volume = 1; });
    	$('.jp-volume-bar-value').css('width', '100%');
    	__debug("Volume Changed [MAX]")   
    });
	
	$('.play_box .app-controlls > #station-change').click(function(event) {
		__debug("User requested station change, stoping play back and switching menu")
		window.clearInterval(_global_int_var);
		pvl_stop_all_playback();
		$('#background').fadeTo("slow", 0.45);
		$('.play_box').fadeOut("slow");
		$('.start_box').fadeIn("slow");
	});
    
    $('.play_box .app-controlls > #jp-play').click(function(event){
    	if($(this).hasClass('btn-disabled'))
    		return;
    	__debug("User pressed `Play`");
    	pvl_play_station();
    	$(this).toggleClass('btn-disabled');
    	$('#jp-stop').toggleClass('btn-disabled');
    });
    
    $('.play_box .app-controlls > #jp-stop').click(function(event){
    	if($(this).hasClass('btn-disabled'))
    		return;
    	__debug("User pressed `Stop`");
    	pvl_stop_all_playback();
    	$(this).toggleClass('btn-disabled');
    	$('#jp-play').toggleClass('btn-disabled');
    });
    
    $('.exit').click(function(event){
    	window.close();
    });
    
    $('.minimize').click(function(event){
    	chrome.app.window.current().minimize();
    });
    
    $('.pvl-nowplaying-votebox a').click(function(e)
	{
		e.preventDefault();

		if (vote_ratelimit)
			return false;

		vote_ratelimit = true;

		if ($(this).hasClass('voted'))
			var vote_function = 'clearvote';
		else if ($(this).hasClass('pvl-nowplaying-voteup'))
			var vote_function = 'like';
		else
			var vote_function = 'dislike';

		var songhist_id = $(this).attr('data-sh_id');

		if (songhist_id == 0)
			return false;

		var remote_url = 'http://ponyvillelive.com/api/song/'+vote_function+'/client/pvldesktopapp/guid/'+__debug_guid;

		jQuery.ajax({
			'type': 'POST',
			'url': remote_url,
			'dataType': 'json',
			'data': {
				'sh_id': songhist_id,
			}
		}).done(function(return_data) {
			vote_ratelimit = false;
			__debug("Voted Submited ["+vote_function+"]");
		});

		var score_display = $(this).closest('.pvl-nowplaying-votebox').find('.pvl-nowplaying-score');
		var score_original = score_display.data('original');

		if (vote_function == 'clearvote')
		{
			$(this).removeClass('voted');
			score_display.text(score_original);
		}
		else
		{
			$(this).siblings('a').removeClass('voted');
			$(this).addClass('voted');

			if (vote_function == 'like')
				var new_score = score_original + 1;
			else
				var new_score = score_original - 1;

			score_display.text(new_score);
		}

		return false;
	});
	
	$('.app-error .app-error-dismiss').click(function(event){
		if($(this).hasClass('btn-disabled'))
    		return;
    	$('.app-error').fadeOut();
		$('.start_box').fadeIn();
	});
	
    __debug("_hook: button hooks loaded!");
}

function pvl_call_post(url, callback)
{
	var xhr = new XMLHttpRequest();
	if(callback != null)
		xhr.onload = callback;
	else
		xhr.onload = function(){__debug(xhr.response);}
	xhr.open('POST', url, true);
	xhr.send();
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
			$('#pvl-station_select_form > #pvl-station_selector').append('<option value="' + station.id + '">' + station.name + '</option>');
			$('.play_box > .audio-streams').append('<audio id="pvl-station-stream_' + station.id + '" src="' + station.stream_url + '" preload="none"></audio>');
		}});
	});
	__debug("_hook: stations loaded");
	__debug("fading in start screen");
	$('.start_box').fadeIn("slow");
}

function pvl_display_station()
{
	$.getJSON('http://ponyvillelive.com/api/nowplaying/index/id/' + _global_sid + '/client/pvldesktopapp', function(data){
		if(data.status != "success") {
			__debug("Whoops! I failed to get data from PVL! Please check your internet connection and try again");
			__debug("[REQUEST] " + 'http://ponyvillelive.com/api/station/list');
			__debug("[STATUS] " + data.status);
			__debug("[RESULT] " + data.error);
			__debug("[SESSION] " + __debug_guid);
			return;
			pvl_error("Failed to connect to PVL!", "Please check your internet and try again. Debug String: " + 
			atob(__debug_guid+":"+navigator.userAgent), false);
		}
		
		data = data.result;
		
		$('.pvl-station-name').each(function(index, element){
		if($(this).attr('data-current') != data.station.name) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', data.station.name);
			$(this).text(data.station.name);
			$(this).fadeIn('slow');
		}});
		
		$('.pvl-station-genre').each(function(index, element){
		if($(this).attr('data-current') != data.station.genre) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', data.station.genre);
			$(this).text(data.station.genre);
			$(this).fadeIn('slow');
		}});
		
		/*CHROME APP IMAGE HANDLING - STATION IMAGE*/
		var xhr = new XMLHttpRequest();
	  	xhr.responseType = 'blob';
	  	xhr.onload = function() {
	  		$('.pvl-station-image').each(function(index, element){	  			
				if($(this).attr('src') != window.URL.createObjectURL(xhr.response))
					$(this).attr('src', window.URL.createObjectURL(xhr.response));
			});
	 	}
	 	xhr.open('GET', data.station.image_url, true);
	 	xhr.send();
		/**************************/
		
		$('.pvl-station-website').each(function(index, element){
		if($(this).attr('href') != data.station.web_url) {
			$(this).attr('href', data.station.web_url);
		}});
		
		$('.pvl-station-twitter').each(function(index, element){
		if($(this).attr('href') != data.station.twitter_url) {
			$(this).attr('href', data.station.twitter_url);
		}});
		
		$('.pvl-nowplaying-listeners').each(function(index, element){
			var listeners = (data.listeners.unique != null ? data.listeners.unique : data.listeners.current);
		if($(this).attr('data-current') != listeners) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', listeners);
			$(this).text(listeners);
			$(this).fadeIn('slow');
		}});
		
		$('.pvl-nowplaying-text').each(function(index, element){
		if($(this).attr('data-current') != data.current_song.text) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', data.current_song.text);
			$(this).text(data.current_song.text);
			$(this).fadeIn('slow');
		}});
		
		$('.pvl-nowplaying-artist').each(function(index, element){
		if($(this).attr('data-current') != data.current_song.artist) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', data.current_song.artist);
			$(this).text(data.current_song.artist);
			$(this).fadeIn('slow');
		}});
		
		$('.pvl-nowplaying-song').each(function(index, element){
		if($(this).attr('data-current') != data.current_song.title) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', data.current_song.title);
			$(this).text(data.current_song.title);
			$(this).fadeIn('slow');
		}});
		
		$('.pvl-nowplaying-score').each(function(index, element){
		if($(this).attr('data-current') != data.current_song.sh_id) {
			$(this).fadeOut('slow');
			$(this).attr('data-current', data.current_song.sh_id);
			$(this).attr('data-original', data.current_song.score);
			$(this).text(data.current_song.score);
			$(this).fadeIn('slow');
		}});
		
		$('.pvl-nowplaying-voteup').each(function(index, element){
		if($(this).attr('data-sh_id') != data.current_song.sh_id) {
			$(this).attr('data-sh_id', data.current_song.sh_id);
		}});
		
		$('.pvl-nowplaying-votedown').each(function(index, element){
		if($(this).attr('data-sh_id') != data.current_song.sh_id) {
			$(this).attr('data-sh_id', data.current_song.sh_id);
		}});
		
		$('.pvl-nowplaying-voteclear').each(function(index, element){
		if($(this).attr('data-sh_id') != data.current_song.sh_id) {
			$(this).attr('data-sh_id', data.current_song.sh_id);
		}});
		
		if(_last_played_song != data.current_song.sh_id)
		{
			$('.pvl-nowplaying-voteup').removeClass('voted');
			$('.pvl-nowplaying-votedown').removeClass('voted');
			
			_last_played_song = data.current_song.sh_id;
			
			var song_image = null;
			if(data.current_song.external.bronytunes != null && data.current_song.external.bronytunes.image_url != null)
				song_image = data.current_song.external.bronytunes.image_url;
			
			notify(data.station.image_url, data.station.name, data.current_song.text, song_image);
		}
		
		$.getJSON('http://ponyvillelive.com/static/api/nowplaying.json', function(data){
			for (var station_id in data)
				if(data[station_id].id == _global_sid && data[station_id].event != null)
					if(data[station_id].event != null)
					{
						$('.pvl-nowplaying-live').fadeIn();
						$('.pvl-nowplaying-live-title').text(data[station_id].event.title);
					}
					else
						$('.pvl-nowplaying-live').fadeOut();
		});
	});
}

function pvl_play_station()
{
	pvl_stop_all_playback();
	var audio_player = document.getElementById('pvl-station-stream_' + _global_sid);
	audio_player.load();
	audio_player.play();
}

function pvl_stop_all_playback() {
	$('*[id^="pvl-station-stream_"]').each(function(index, element){ this.pause(); });
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
	pvl_stop_all_playback();
    $('#jp-stop').removeClass('btn-disabled');
    $('#jp-play').addClass('btn-disabled');
	$('.start_box').fadeOut();
	$('.play_box').fadeOut();
	
	$('.app-error .app-error-title').text(title);
	$('.app-error .app-error-body').text(message);
	continue_allowed ? $('.app-error .app-error-dismiss').fadeIn() : $('.app-error .app-error-dismiss').fadeOut();
	
	$('.app-error').fadeIn();
}
