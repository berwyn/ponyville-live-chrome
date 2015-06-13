export default function(module) {
  /** ngInject **/
  function StationListCtrl($scope, $mdToast, EventBus, PvlService) {
    let vm = this;

    vm.imgUrls = {};
    vm.nowPlaying = {};
    vm.currentIndex = null;
    vm.setSelected = setSelected;

    function setSelected(index) {
      if(vm.stations[index].category === 'video') {
        let toast = $mdToast.simple()
          .content('Video streams aren\'t currently supported :(')
          .capsule(false);

        $mdToast.show(toast);
        return;
      }

      if(vm.stations[index].streams.length === 0 || vm.stations[index].offline) {
        return;
      }

      vm.currentIndex = index;
      EventBus.emit('pvl:stationSelect', vm.stations[index]);
      EventBus.emit('pvl:selection', {type: 'audio'});
    }

    PvlService.getStations(vm.type)
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
      scope: {
        type: '@'
      },
      controller: StationListCtrl,
      controllerAs: 'stationList',
      bindToController: true
    };
  }

  angular
    .module(module.name)
    .directive('pvlStationList', StationListDirective);
}