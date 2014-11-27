/************************************
 * GOBAL SETTINGS
 ************************************/

var app_version = chrome.runtime.getManifest().version;
var app_beta = true;
var app_transport_method = "http:";
var debug_guid = null;

var key_embedly = "18cd5d207d22424a8ef9a795b8f2edc1";

var last_played_song = 0;
var log_array = [];

var display_station = $('.display #station .station');
var display_nowplaying = $('.display #station .nowplaying');
var display_controls = $('.display #station .controls');
var display_stream = $('.display #video');
var display_stream_video = $('.display #video webview');
