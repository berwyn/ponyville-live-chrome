getStats = function(){
	var version = chrome.runtime.getManifest().version;
  	var match = navigator.userAgent.match(/(CrOS\ \w+|Windows\ NT|Mac\ OS\ X|Linux)\ ([\d\._]+)?/);
  	var os = (match || [])[1] || "Unknown";
  	var osVersion = (match || [])[2] || "Unknown";
  	
  	return {
  		'version': version,
  		'OS': os,
  		'OSversion': osVersion
  	};
};

loadButtonHandlers = function(){
	$('.app-error .app-error-dismiss').click(function(event) {
		if ($(this).hasClass('btn-disabled'))
			return;
		$('.app-error').fadeOut();
		$('#container').fadeIn();
	});
	
	$('.list_controls #radio').click(function(event){
		if ($(this).hasClass('btn-disabled'))
			return;
			
		$('.list_controls input').each(function(index){$(this).removeClass("selected");});
		$(this).addClass("selected");
		
		$('.stream_list').fadeOut();
		$('.settings').fadeOut();
		$('.station_list').fadeIn();
	});
	
	$('.list_controls #stream').click(function(event){
		if ($(this).hasClass('btn-disabled'))
			return;
			
		$('.list_controls input').each(function(index){$(this).removeClass("selected");});
		$(this).addClass("selected");
		
		$('.station_list').fadeOut();
		$('.settings').fadeOut();
		$('.stream_list').fadeIn();
	});
	
	$('.list_controls #settings').click(function(event){
		if ($(this).hasClass('btn-disabled'))
			return;
			
		$('.list_controls input').each(function(index){$(this).removeClass("selected");});
		$(this).addClass("selected");
		
		$('.station_list').fadeOut();
		$('.stream_list').fadeOut();
		$('.settings').fadeIn();
	});

	$('.volume-bar').click(function(e) {
		var posX = $(this).offset().left, volume = (e.pageX - posX) / $(this).width();

		$('li[id^="station_"] > audio').each(function(index, element) {
			this.volume = volume;
		});

		$('.volume-bar-value').css('width', volume * 100 + '%');
		debug("Volume Changed [" + volume * 100 + "%]");
	});

	$('.pause').click(function(event) {
		event.preventDefault();
		$('.station_list .station').each(function(index) {
			$(this).removeClass('playing');
			$(this).find('audio')[0].pause();
		});
		debug("Station Playback Stoped");
	});

	$('.mute').click(function(event) {
		event.preventDefault();
		$('li[id^="station_"] > audio').each(function(index, element) {
			this.volume = 0;
		});
		$('.volume-bar-value').css('width', '0%');
		debug("Volume Changed [MUTE]");
	});

	$('.volume-max').click(function(event) {
		event.preventDefault();
		$('li[id^="station_"] > audio').each(function(index, element) {
			this.volume = 1;
		});
		$('.volume-bar-value').css('width', '100%');
		debug("Volume Changed [MAX]");
	});

	$('.vote a').click(function(event) {
		event.preventDefault();

		if ($(this).hasClass('vote-down') && !$(this).hasClass('selected')) {
			_vote_type = "dislike";
			display_controls.find('.vote .nowplaying-score').text(Number(display_controls.find('.vote .nowplaying-score').attr('data-orginal')) - 1);
			display_controls.find('.vote .vote-up').removeClass('selected');
		} else if ($(this).hasClass('vote-up') && !$(this).hasClass('selected')) {
			_vote_type = "like";
			display_controls.find('.vote .nowplaying-score').text(Number(display_controls.find('.vote .nowplaying-score').attr('data-orginal')) + 1);
			$('.display .controls .vote .vote-down').removeClass('selected');
		} else if ($(this).hasClass('selected')) {
			_vote_type = "clearvote";
			display_controls.find('.vote .nowplaying-score').text(Number(display_controls.find('.vote .nowplaying-score').attr('data-orginal')));
		}

		$(this).toggleClass('selected');

		_song_id = $('.display .controls .vote .nowplaying-score').attr('data-id');

		$.post("http://ponyvillelive.com/api/song/" + _vote_type + "/sh_id/" + _song_id, function(data) {
			debug("Song Vote [" + _vote_type + "] - Response [" + data.status + "]");
			console.log(data);
		});
	});

	debug("Button handlers loaded!");
};

loadStationsIntoList = function(){
	$.getJSON('http://ponyvillelive.com/api/station/list/client/pvldesktopapp/guid/' + guid(), function(data) {
		if (data.status != "success") {
			debug("Whoops! I failed to get data from PVL! Please check your internet connection and try again");
			debug("[REQUEST] " + 'http://ponyvillelive.com/api/station/list/');
			debug("[STATUS] " + data.status);
			debug("[RESULT] " + data.error);
			debug("[SESSION] " + guid());
	
			pvl_error("Failed to connect to PVL!", "Please check your internet and try again. " + guid() + ":" + data.status + ":" + data.error, false);
			return;
		}

		data.result.forEach(function(station) {
			if (station.category == "audio") {
				$(".station_list").append('<li class="station" id="station_' + station.shortcode + '" data-id="' + station.id + '" data-name="' + station.name + '"></li>');
	
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = function() {
					station_li = $('li[id="station_' + station.shortcode + '"]');
					station_li.append('<img src="' + window.URL.createObjectURL(xhr.response) + '">');
	
					station_li.append('<h4>' + station.name + '</h4>');
					station_li.find('h4').append('<span class="nowplaying-info"><span class="nowplaying-listeners"></span></span>');
					station_li.append('<p class="genre-info">' + station.genre + '</p>');
	
					station_li.append('<p class="nowplaying-onair"><span class="nowplaying-onair-inner"></span></p>');
					station_li.append('<p class="nowplaying-song"></p>');
					station_li.append('<p class="nowplaying-artist"></p>');
					station_li.append('<audio style="display: none;" preload="none" src="' + station.stream_url + '"></audio>');
				};
				xhr.open('GET', app_transport_method + station.image_url, true);
				xhr.send();
			}
			else if (station.category == "video") {
				$(".stream_list").append('<li class="stream" id="stream_' + station.shortcode + '" data-id="' + station.id + '" data-name="' + station.name + '"></li>');
	
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = function() {
					station_li = $('li[id="stream_' + station.shortcode + '"]');
					station_li.append('<img src="' + window.URL.createObjectURL(xhr.response) + '">');
	
					station_li.append('<h4>' + station.name + '</h4>');
					station_li.find('h4').append('<span class="nowplaying-info"><span class="nowplaying-listeners"></span></span>');
					station_li.append('<p class="genre-info">' + station.genre + '</p>');
	
					station_li.append('<p class="nowplaying-onair"><span class="nowplaying-onair-inner"></span></p>');
					station_li.append('<p class="nowplaying-song"></p>');
					station_li.append('<p class="nowplaying-artist"></p>');
					station_li.append('<span style="display: none;" class="stream_url" src="' + station.stream_url + '"></span>');
				};
				xhr.open('GET', app_transport_method + station.image_url, true);
				xhr.send();
			}
		});
		
		$('.station_list .station').click(function(event) {
			if ($(this).hasClass("offline"))
				return;

			if ($(this).hasClass('playing')) {
				$('#container > .display').fadeOut();
				$('#background > #welcome-message').fadeIn();
				$('#background > #mascot').fadeIn();
				$('#background > #logotype').fadeIn();
				$('#facebook').fadeIn();
				display_stream.html('');
				$('.station_list .station').each(function(index) {
					$(this).removeClass('playing');
					$(this).find('audio')[0].pause();
				});
				$('.station_list .stream').each(function(index) {
					$(this).removeClass('playing');
				});
				display_station.attr('data-station-id', 0);
			} else {
				display_stream.html('');
				$('.station_list .station').each(function(index) {
					$(this).removeClass('playing');
					$(this).find('audio')[0].pause();
				});
				$('.station_list .stream').each(function(index) {
					$(this).removeClass('playing');
				});
				
				$('#background > #welcome-message').fadeOut();
				$('#background > #mascot').fadeOut();
				$('#background > #logotype').fadeOut();
				$('#facebook').fadeOut();

				$(this).addClass('playing');
				display_station.attr('data-station-id', $(this).attr('data-id'));
				$(this).find('audio')[0].load();
				$(this).find('audio')[0].play();

				$('#container > .display').fadeIn();
				updateStationsAndStreams();
			}
		});
		
		$('.station_list .stream').click(function(event) {
			/*if ($(this).hasClass("offline"))
				return;*/

			if ($(this).hasClass('playing')) {
				$('#container > .display').fadeOut();
				$('#background > #welcome-message').fadeIn();
				$('#background > #mascot').fadeIn();
				$('#background > #logotype').fadeIn();
				$('#facebook').fadeIn();
				display_stream.html('');
				$('.station_list .station').each(function(index) {
					$(this).removeClass('playing');
					$(this).find('audio')[0].pause();
				});
				$('.station_list .stream').each(function(index) {
					$(this).removeClass('playing');
				});
				display_station.attr('data-station-id', 0);
			} else {
				
				display_stream.html('');
				$('.station_list .station').each(function(index) {
					$(this).removeClass('playing');
					$(this).find('audio')[0].pause();
				});
				$('.station_list .stream').each(function(index) {
					$(this).removeClass('playing');
				});
				
				$('#background > #welcome-message').fadeOut();
				$('#background > #mascot').fadeOut();
				$('#background > #logotype').fadeOut();
				$('#facebook').fadeOut();

				$(this).addClass('playing');
				$.getJSON('http://api.embed.ly/1/oembed?key=18cd5d207d22424a8ef9a795b8f2edc1&url=' + $(this).find('.stream_url').attr('src'), function(data) {
					if(data.html != null)
					{
						var embed_url = $(data.html).attr('src');
						display_stream.html('<webview src="'+embed_url+'" style="width: 540px;"></webview>');
					}
				});

				$('#container > .display').fadeIn();
				updateStationsAndStreams();
			}
		});
		
		updateStationsAndStreams();
		setInterval(function(){updateStationsAndStreams();}, 15000);
		
		debug("Stations and streams loaded");
	});
};

updateStationsAndStreams = function(){
	$.getJSON('http://ponyvillelive.com/api/nowplaying/', function(data) {
		if (data == null) {
			debug("Whoops! I failed to get data from PVL! Please check your internet connection and try again");
			debug("[REQUEST] " + 'http://ponyvillelive.com/api/nowplaying/');
			debug("[RESULT] " + data);
			debug("[SESSION] " + guid());

			pvl_error("Failed to connect to PVL!", "Please check your internet and try again. " + guid() + ":" + data.status + ":" + data.error, false);
			return;
		}

		for (station_data in data.result)
		{
			station_data = data.result[station_data];
			if(station_data.station.category == "audio")
			{
				if ($('li[id="station_' + station_data.station.shortcode + '"]') == 0)
					continue;
					
				station_li = $('li[id="station_' + station_data.station.shortcode + '"]');
				
				if (station_data.current_song.text == "Station Offline") {
					station_li.addClass("offline");
					station_li.find('h4 > .nowplaying-info > .nowplaying-listeners').html('<i class="fa fa-user"></i>&nbsp;Offline');
					station_li.find('.nowplaying-song').text("Station Offline");
					continue;
				} else
					station_li.removeClass("offline");
					
				station_li.find('h4 > .nowplaying-info > .nowplaying-listeners').html('<i class="fa fa-user"></i>&nbsp;' + station_data.listeners.current);
				station_li.find('h4 > .nowplaying-info > .nowplaying-listeners').attr('title', station_data.listeners.current + ' Listeners');
	
				station_li.find('.nowplaying-song').text(station_data.current_song.title);
				station_li.find('.nowplaying-song').attr('title', station_data.current_song.title);
	
				station_li.find('.nowplaying-artist').text(station_data.current_song.artist);
				station_li.find('.nowplaying-artist').attr('title', station_data.current_song.artist);
				
				if (station_data.event.length != 0) {
					station_li.addClass('live');
					station_li.find('.nowplaying-onair > .nowplaying-onair-inner').html('<i class="fa fa-star"></i>&nbsp;' + station_data.event.title);
					station_li.find('.nowplaying-onair > .nowplaying-onair-inner').attr('title', station_data.event.title);
					station_li.find('.nowplaying-onair > .nowplaying-onair-inner').fadeIn();
				} else {
					station_li.removeClass('live');
					station_li.find('.nowplaying-onair > .nowplaying-onair-inner').fadeOut();
				}
	
				if (station_data.station.id == display_station.attr('data-station-id')) {				
					display_station.find('img').attr('src', station_li.find('img').attr('src'));
	
					display_station.find('.info > h1').text(station_data.station.name);
					display_station.find('.info > h1').append('<span class="nowplaying-info"><span class="nowplaying-listeners"></span></span>');
					display_station.find('.info > .genre-info').text(station_data.station.genre);
	
					display_nowplaying.find('.panel-top > h4 > .nowplaying-station-listeners').text(station_data.listeners.current + ' Listeners Tuned In');
	
					if (last_played_song != station_data.current_song.sh_id) {
						display_nowplaying.find('.nowplaying-info > .nowplaying-song').text(station_data.current_song.title);
						display_nowplaying.find('.nowplaying-info > .nowplaying-song').attr('title', station_data.current_song.title);
	
						display_nowplaying.find('.nowplaying-info > .nowplaying-artist').text(station_data.current_song.artist);
						display_nowplaying.find('.nowplaying-info > .nowplaying-artist').attr('title', station_data.current_song.artist);
	
						display_controls.find('.vote .nowplaying-score').attr('data-id', station_data.current_song.sh_id);
						display_controls.find('.vote .nowplaying-score').attr('data-orginal', station_data.current_song.score);
						display_controls.find('.vote .nowplaying-score').text(station_data.current_song.score);
	
						display_controls.find('.vote a').each(function(index) {
							$(this).removeClass("selected");
						});
	
						last_played_song = station_data.current_song.sh_id;
	
						if (station_data.current_song.external != null && station_data.current_song.external.bronytunes != null && station_data.current_song.external.bronytunes.image_url != null)
							notify(station_data.station.image_url, station_data.station.name, station_data.current_song.text, station_data.current_song.external.bronytunes.image_url);
						else
							notify(station_data.station.image_url, station_data.station.name, station_data.current_song.text, null);
					}
				}
			}
			else if(station_data.station.category == "video")
			{
				if ($('li[id="stream_' + station_data.station.shortcode + '"]') == 0)
					continue;
					
				stream_li = $('li[id="stream_' + station_data.station.shortcode + '"]');
				
				if (station_data.current_song.text == "Stream Offline") {
					stream_li.addClass("offline");
					stream_li.find('h4 > .nowplaying-info > .nowplaying-listeners').html('<i class="fa fa-user"></i>&nbsp;Offline');
					stream_li.find('.nowplaying-song').text("Stream Offline");
					continue;
				} else
					stream_li.removeClass("offline");
					
				
			}
		}
	});
};

notify = function(image, notification_title, description, song_image) {
	debug("Notify Called");
	var opt = {
		type : "basic",
		title : notification_title,
		message : description,
	};

	opt.priority = 2;

	debug("Converting image [" + image + "] to blob");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", app_transport_method + image);
	xhr.responseType = "blob";
	xhr.onload = function() {
		var blob = this.response;
		opt.iconUrl = window.URL.createObjectURL(blob);

		if (song_image != null)
			notify_image(opt, song_image);
		else
			chrome.notifications.create("id" + last_played_song, opt, creationCallback);
	};
	xhr.send(null);
};

notify_image = function(opt, song_image) {
	debug("Notify Image Called");
	opt.type = "image";

	debug("Converting image [" + song_image + "] to blob");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", song_image);
	xhr.responseType = "blob";
	xhr.onload = function() {
		var blob = this.response;
		opt.imageUrl = window.URL.createObjectURL(blob);
		chrome.notifications.create("id" + last_played_song, opt, creationCallback);
	};
	xhr.send(null);
};

creationCallback = function(notID) {
	debug("Succesfully created " + notID + " notification");
	setTimeout(function() {
		chrome.notifications.clear(notID, function(wasCleared) {
			debug("Notification " + notID + " cleared: " + wasCleared);
		});
	}, 5000);
};