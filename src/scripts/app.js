import {default as Config} from "./Config";
import {default as EventBus} from "./EventBus";
import {default as MainCtrl} from "./MainCtrl";
import {default as MediaPlayer} from "./MediaPlayer";
import {default as OfflineFilter} from "./OfflineFilter";
import {default as PvlService} from "./PvlService";
import {default as StationList} from "./StationList";
import {default as ShowList} from "./ShowList";

/* global _, io, moment, ColorThief */
var ngMod = angular
  .module('PVL', ['ngAnimate', 'ngMaterial'])
  .constant('io', io)
  .constant('jQuery', $)
  .constant('moment', moment)
  .constant('_', _)
  .constant('ColorThief', ColorThief);

/*
 * Each of our functions exports a "load"
 * function we need to invoke with our module
 */

Config(ngMod);
EventBus(ngMod);
MainCtrl(ngMod);
MediaPlayer(ngMod);
OfflineFilter(ngMod);
PvlService(ngMod);
StationList(ngMod);
ShowList(ngMod);