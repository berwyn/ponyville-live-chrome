angular
  .module('PVL', []);

var config = function config($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);
};

angular
  .module('PVL')
  .config(config);
  
var MainCtrl = function MainCtrl(PvlService) {
  var vm = this;

  vm.appVersion = app_version + (app_beta? '_BETA' : '');
  vm.stations = [];
  vm.stationCache = {
    audio: [],
    video: []
  }

  PvlService
    .getStations('audio')
    .then(function(stations) {
      vm.stations = stations;
      vm.stationCache.audio = stations;
    })
    .catch(function(err) {
      // TODO: Handle
    });
};

angular
  .module('PVL')
  .controller('MainCtrl', MainCtrl);
  
var PvlService = function PvlService($http, $q) {
  var ServiceHost = {};
  ServiceHost.apiBase = "https://ponyvillelive.com/api";

  ServiceHost.getStations = function getStations(type) {
    var deferred = $q.defer();
    
    $http
      .get(this.apiBase + "/station/list/category/" + type)
      .success(function(json, status, headers, config) {
        deferred.resolve(json.result);
      })
      .error(function(data, status, headers, config) {
        deferred.reject(data);
      });
    
    return deferred.promise;
  };

  return ServiceHost;
};

angular
  .module('PVL')
  .service('PvlService', PvlService);

var StationListCtrl = function StationListCtrl($scope, $http, $sce) {
  var vm = this;
  vm.stations = $scope.stations;
  vm.imgUrls = {};
  $scope
    .$watchCollection('stations', function(replace, old) {
      vm.stations = replace;
      replace.forEach(function(station) {
        $http
          .get('http:'+station.image_url, {responseType: 'blob'})
          .success(function(response, status, headers, config) {
            var fileUrl = URL.createObjectURL(response);
            vm.imgUrls[station.shortcode] = $sce.trustAsResourceUrl(fileUrl);
          });
      });
    });
};

var StationListDirective = function StationListDirective() {
  return {
    restrict: 'E',
    templateUrl: '/stationList.html',
    scope: {
      stations: '='
    },
    controller: StationListCtrl,
    controllerAs: 'stationList'
  }
};

angular
  .module('PVL')
  .directive('stationList', StationListDirective);
