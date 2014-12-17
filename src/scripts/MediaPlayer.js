/** ngInject **/
function MediaPlayerCtrl(PvlService, $scope) {
  let vm = this;

  vm.nowPlaying = {};
  vm.togglePlayback = togglePlayback;

  function togglePlayback() {
    if(vm.mediaElement.paused) {
      vm.mediaElement.play();
    } else {
      vm.mediaElement.pause();
    }
  };
  
  PvlService.getNowPlaying()
    .on('nowplaying', data => {
      if(!vm.station) return;
      vm.nowPlaying = data[vm.station.shortcode];
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    });
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
    bindToController: true,
    link: function(scope, el) {
      // We want the controller to have access to the raw DOM element
      scope.mediaPlayer.mediaElement = angular.element('audio', el)[0];
    }
  };
}

angular
  .module('PVL')
  .directive('pvlMediaPlayer', MediaPlayerDirective);