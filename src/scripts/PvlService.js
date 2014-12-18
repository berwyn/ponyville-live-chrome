/** ngInject **/
function PvlService($http, $q, $sce, io) {
  let apiHost = "https://ponyvillelive.com";
  let apiBase = `${apiHost}/api`;

  var socket;
  
  function getStations(type) {
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