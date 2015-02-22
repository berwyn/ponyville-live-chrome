/** ngInject **/
function StationListCtrl($scope, EventBus, PvlService) {
  let vm = this;

  vm.imgUrls = {};
  vm.nowPlaying = {};
  vm.currentIndex = null;
  vm.setSelected = setSelected;

  function setSelected(index) {
    vm.currentIndex = index;
    EventBus.emit('pvl:stationSelect', vm.stations[index]);
  }

  PvlService.getStations('audio')
    .then(stations => vm.stations = stations);

  let nowPlayingListener = (event, data) => {
    vm.nowPlaying = data;
  };

  let unsubNowPlaying = EventBus.on('pvl:nowPlaying', nowPlayingListener);
  $scope.$on('$destroy', () => {
    unsubNowPlaying();
  });
}

function StationListDirective() {
  return {
    restrict: 'E',
    templateUrl: '/stationList.html',
    scope: true,
    controller: StationListCtrl,
    controllerAs: 'stationList',
    bindToController: true
  };
}

angular
  .module('PVL')
  .directive('pvlStationList', StationListDirective);