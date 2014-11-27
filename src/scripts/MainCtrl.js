/** ngInject **/
function MainCtrl(PvlService) {
  var vm = this,
      app_version = angular.module('PVL').value('app_version'),
      app_beta = angular.module('PVL').value('app_beta');

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