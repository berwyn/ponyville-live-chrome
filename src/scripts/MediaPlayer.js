/** ngInject **/
function MediaPlayerCtrl(PvlService, $scope, ColorThief) {
  let vm = this;
  let defaultArtwork = '/images/mascot.png';
  let colorThief = new ColorThief();

  vm.nowPlaying = {};
  vm.togglePlayback = togglePlayback;
  vm.artworkUrl = defaultArtwork;

  function togglePlayback() {
    if(vm.mediaElement.paused) {
      vm.mediaElement.play();
    } else {
      vm.mediaElement.pause();
    }
  };
  
  PvlService.getNowPlaying()
    .on('nowplaying', data => {

      /**
       * This function is outside of the digest cycle,
       * so any updates to the scope need to trigger a
       * digest cycle through $scope.$apply().
       *
       * Yes, this is gross.
       */

      if(!vm.station) return;
      vm.nowPlaying = data[vm.station.shortcode];
      
      var externalData = vm.nowPlaying.current_song.external;
      if(externalData.hasOwnProperty('bronytunes')) {
        if(externalData.bronytunes.hasOwnProperty('image_url')) {
          vm.artworkUrl = externalData.bronytunes.image_url;
        } else {
          vm.artworkUrl = defaultArtwork;
        }
      } else {
        vm.artworkUrl = defaultArtwork;
      }

      // Digest to apply the image
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
      scope.mediaPlayer.artworkImg = angular.element('.artwork img', el);
    }
  };
}

angular
  .module('PVL')
  .directive('pvlMediaPlayer', MediaPlayerDirective);