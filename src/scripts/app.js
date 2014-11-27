var app_version = chrome.runtime.getManifest().version,
    app_beta    = true;

angular
  .module('PVL', []);

function config($compileProvider) {
  $compileProvider
    .imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);
}

angular
  .module('PVL')
  .config(config);

function MainCtrl(PvlService) {
  var vm = this;

  vm.appVersion = app_version + (app_beta? '_BETA' : '');
  vm.stations = [];
  vm.stationCache = {
    audio: [],
    video: []
  }
  vm.selected = null;

  PvlService
    .getStations('audio')
    .then(function(stations) {
      vm.stations = stations;
      vm.stationCache.audio = stations;
    })
    .catch(function(err) {
      // TODO: Handle
    });
}

angular
  .module('PVL')
  .controller('MainCtrl', MainCtrl);

function PvlService($http, $q, $sce) {
  var ServiceHost = {};
  ServiceHost.apiBase = "https://ponyvillelive.com/api";

  ServiceHost.getStations = function getStations(type) {
    var deferred = $q.defer();

    $http
      .get(this.apiBase + "/station/list/category/" + type, {
        transformResponse: function(data) {
          var payload = JSON.parse(data),
              stations = payload.result;

          stations.forEach(function(station) {
            station.safe_img_url = '';
            station.stream_url = $sce.trustAsResourceUrl(station.stream_url);
            $http
              .get(station.image_url, {responseType: 'blob'})
              .success(function(response, status, headers, config) {
                var fileUrl = URL.createObjectURL(response);
                station.safe_img_url = $sce.trustAsResourceUrl(fileUrl);
              });
          });
          
          return payload;
        }
      })
      .success(function(json) {
        deferred.resolve(json.result);
      })
      .error(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  };

  ServiceHost.getNowPlaying = function getNowPlaying() {
    var deferred = $q.defer();

    $http
      .get(this.apiBase + '/nowplaying')
      .success(function(json) {
        deferred.resolve(json.result);
      })
      .error(function(err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }

  return ServiceHost;
}

angular
  .module('PVL')
  .service('PvlService', PvlService);

function StationListCtrl(PvlService) {
  var vm = this;

  vm.imgUrls = {};
  vm.nowPlaying = {};
  vm.currentIndex = null;

  vm.setSelected = function setSelected(index) {
    vm.selected = vm.stations[index];
    vm.currentIndex = index;
  }

  var intervalId = setInterval(function() {
    PvlService
      .getNowPlaying()
      .then(function(playingMeta) {
        vm.nowPlaying = playingMeta;
      });    
  }, 3000);

  angular
    .module('PVL')
    .value('intervalId', intervalId);

  chrome
    .runtime
    .onSuspend
    .addListener(function() {
      clearInterval(angular.module('PVL').value('intervalId'));
    });
}

function StationListDirective() {
  return {
    restrict: 'E',
    templateUrl: '/stationList.html',
    scope: {
      stations: '=',
      selected: '='
    },
    controller: StationListCtrl,
    controllerAs: 'stationList',
    bindToController: true
  }
}

angular
  .module('PVL')
  .directive('stationList', StationListDirective);

function MediaPlayerCtrl() {
  var vm = this;

  vm.isPlaying = false;
  vm.togglePlayback = function togglePlayback() {
    
  }
}

function MediaPlayerDirective() {
  return {
    restrict: 'E',
    templateUrl: '/mediaPlayer.html',
    scope: {
      station: '=',
    },
    controller: MediaPlayerCtrl,
    controllerAs: 'mediaPlayer',
    bindToController: true
  };
}

angular
  .module('PVL')
  .directive('mediaPlayer', MediaPlayerDirective);