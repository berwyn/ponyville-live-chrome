/** ngInject **/
function StationListCtrl($scope, $rootScope, PvlService) {
  let vm = this;

  vm.imgUrls = {};
  vm.nowPlaying = {};
  vm.currentIndex = null;
  vm.setSelected = setSelected;

  function setSelected(index) {
    vm.currentIndex = index;
    $rootScope.$emit('pvl:stationSelect', vm.stations[index]);
  }

  PvlService.getStations('audio')
    .then(stations => vm.stations = stations);

  PvlService.getNowPlaying()
    .on('nowplaying', data => $scope.$apply(()=> vm.nowPlaying = data));
}

function StationListDirective() {
  return {
    restrict: 'E',
    templateUrl: '/stationList.html',
    scope: true,
    controller: StationListCtrl,
    controllerAs: 'stationList',
    bindToController: true
  }
}

angular
  .module('PVL')
  .directive('pvlStationList', StationListDirective);