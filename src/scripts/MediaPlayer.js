/** ngInject **/
function MediaPlayerCtrl(PvlService, $scope, ColorThief, $timeout) {
  let vm = this;
  let defaultArtwork = '/images/mascot.png';
  let colorThief = new ColorThief();

  vm.nowPlaying = {};
  vm.artworkUrl = defaultArtwork;
  vm.isLoading = true;
  vm.isPlaying = false;
  vm.togglePlayback = togglePlayback;

  function togglePlayback() {
    if(vm.mediaElement.paused) {
      vm.mediaElement.play();
    } else {
      vm.mediaElement.pause();
    }
  }

  $timeout(() => {
    var el = angular.element(vm.mediaElement);

    el.on('loadstart', $scope.$apply(()=>vm.isLoading=true));
    el.on('canplay', $scope.$apply(()=>vm.isLoading=false));

    el.on('play', $scope.$apply(()=>vm.isPlaying=true));
    el.on('pause', $scope.$apply(()=>vm.isPlaying=false));
  });
  
  PvlService
    .getNowPlaying()
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
      
      var externalData = vm.nowPlaying.current_song.external,
          url = defaultArtwork;
      
      if(externalData.hasOwnProperty('bronytunes')) {
        if(externalData.bronytunes.hasOwnProperty('image_url')) {
          url = externalData.bronytunes.image_url;
        }
      }

      $scope.$apply(() => {
        vm.nowPlaying = data[vm.station.shortcode];
        vm.artworkUrl = url;
      });
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