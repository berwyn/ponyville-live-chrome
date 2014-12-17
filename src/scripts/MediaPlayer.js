/** ngInject **/
function MediaPlayerCtrl() {
  let vm = this;

  vm.togglePlayback = togglePlayback;

  function togglePlayback() {
    if(vm.mediaElement.paused) {
      vm.mediaElement.play();
    } else {
      vm.mediaElement.pause();
    }
  };
  
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