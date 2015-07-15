/// <reference path="tsd.d.ts" />

// globals
declare var io: any;
declare var $: any;
declare var moment: any;
declare var ColorThief: any;
declare var _: any;

import { PVLConfiguration } from 'Config';
import { EventBus } from 'EventBus';
import { MainCtrl } from 'MainCtrl';
import { MediaPlayerDirective } from 'MediaPlayer';
import { OfflineFilter } from 'OfflineFilter';
import { PVLService } from 'PvlService';
import { StationListDirective } from 'StationList';
import { ShowListDirective } from 'ShowList';

angular
  .module('PVL', ['ngAnimate', 'ngMaterial'])
  
  // Load our constants into Angular's DI
  .constant('io', io)
  .constant('jQuery', $)
  .constant('moment', moment)
  .constant('_', _)
  .constant('ColorThief', ColorThief)
  
  // Bootstrap our components
  .config(PVLConfiguration)
  .service('EventBus', EventBus)
  .controller('MainCtrl', MainCtrl)
  .directive('pvlMediaPlayer', MediaPlayerDirective)
  .filter('offline', OfflineFilter)
  .service('PVLService', PVLService)
  .directive('pvlStationList', StationListDirective)
  .directive('pvlShowList', ShowListDirective);

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