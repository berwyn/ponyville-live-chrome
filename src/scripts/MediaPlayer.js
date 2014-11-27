/** ngInject **/
function MediaPlayerCtrl() {
  var vm = this;

  vm.isPlaying = false;
  vm.togglePlayback = function togglePlayback() {
    
  }
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
    bindToController: true
  };
}

angular
  .module('PVL')
  .directive('pvlMediaPlayer', MediaPlayerDirective);