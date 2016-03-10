import Config from './Config';
import EventBus from './EventBus';
import MainCtrl from './MainCtrl';
import MediaPlayer from './MediaPlayer';
import OfflineFilter from './OfflineFilter';
import PvlService from './PvlService';
import StationList from './StationList';
import ShowList from './ShowList';

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