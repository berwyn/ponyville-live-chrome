/** ngInject **/
function PvlService($http, $q, $sce, io) {
  let apiHost = "https://ponyvillelive.com";
  let apiBase = `${apiHost}/api`;

  var socket,
      stationCache = {};
  
  function getStations(type) {
    var deferred = $q.defer();

    if(stationCache[type]) {
      deferred.resolve(stationCache[type]);
      return;
    }

    $http
      .get(`${this.apiBase}/station/list/category/${type}`, {
        transformResponse: data => {
          var payload = JSON.parse(data),
              stations = payload.result;

          stations.forEach(station => {
            station.safe_img_url = '';
            $http
              .get(`${station.image_url}`, {responseType: 'blob'})
              .success(response => {
                var fileUrl = URL.createObjectURL(response);
                station.safe_img_url = $sce.trustAsResourceUrl(fileUrl);
              })
              .error(() => station.safe_img_url = '/images/pvl_128.png');
          });
            
          return payload;
        }
      })
      .success(json => {
        deferred.resolve(json.result);
        stationCache[type] = json.result;
      })
      .error(err => deferred.reject(err));

      return deferred.promise;
  }

  function getNowPlaying() {
    if(!socket) {
      socket = io("wss://api.ponyvillelive.com", {path: '/live'});
    }
    return socket;
  }

  return {apiBase, getStations, getNowPlaying};
}

angular
    .module('PVL')
    .service('PvlService', PvlService);