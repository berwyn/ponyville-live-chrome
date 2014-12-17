/** ngInject **/
function StationListCtrl(PvlService, $scope) {
  let vm = this;

  vm.imgUrls = {};
  vm.nowPlaying = PvlService.getNowPlaying();
  vm.currentIndex = null;

  vm.setSelected = function setSelected(index) {
    vm.selected = vm.stations[index];
    vm.currentIndex = index;
  }
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
  .directive('pvlStationList', StationListDirective);