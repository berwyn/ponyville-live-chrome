export default function(module) {
  /** ngInject **/
  function PvlService($http, $q, $sce, io) {
    let apiHost = "https://api.ponyvillelive.com";
    let apiBase = `${apiHost}`;

    var socket,
        stationCache = {},
        showCache = [];

    function cleanPayloadUrls(payload) {
      payload.result.forEach(item => {
        item.safeImgUrl = '';
        $http
          .get(`${item.image_url}`, {responseType: 'blob'})
          .success(response => {
            var fileUrl = URL.createObjectURL(response);
            item.safeImgUrl = $sce.trustAsResourceUrl(fileUrl);
          })
          .error(() => item.safeImgUrl = '/images/pvl_128.png');
      });
    }
    
    function getStations(type) {
      var deferred = $q.defer();

      if(stationCache[type]) {
        deferred.resolve(stationCache[type]);
        return;
      }

      $http
        .get(`${this.apiBase}/station/list/category/${type}`, {
          transformResponse: data => {
            var payload = JSON.parse(data);
            cleanPayloadUrls(payload);              
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

    function getShows() {
      var deferred = $q.defer();

      if(showCache.length > 0) {
        deferred.resolve(showCache);
        return;
      }

      $http
        .get(`${this.apiBase}/show/index`, {
          transformResponse: data => {
            var payload = JSON.parse(data);
            cleanPayloadUrls(payload);
            return payload;
          }
        })
        .success(response => {
          deferred.resolve(response.result);
        })
        .error(() => deferred.reject(new Error('Request failed')));

        return deferred.promise;
    }

    function getNowPlaying() {
      if(!socket) {
        socket = io("wss://api.ponyvillelive.com", {path: '/live'});
      }
      return socket;
    }

    return {apiBase, getStations, getNowPlaying, getShows};
  }

  angular
      .module(module.name)
      .service('PvlService', PvlService);
}