export default function(module) {
  /** ngInject **/
  function MediaPlayerCtrl(_, $scope, $element, $interval, $sce, EventBus) {

    /**
     * To make sure we have access to the viewmodel in all closures
     * we declare it as a local, immutable variable.
     */
    const vm = this;

    /**
     * These variables are all immutable values used throughout
     * the code.
     */
    const defaultArtwork = '/images/mascot.png';
    let playingCache = {};

    /**
     * The only way to prevent buffering is to not have an element
     * on the page. As such, we're handling it from inside the
     * controller. May the DOM burn in hell.
     */
    function createMediaEl() {
      let mediaEl = document.createElement('audio');
      
      mediaEl.setAttribute('autoplay', true);
      mediaEl.setAttribute('preload', 'auto');
      mediaEl.volume = vm.audioVolume;

      mediaEl.onloadstart = () => $scope.$apply(() => vm.state = 'loading');
      mediaEl.onplay      = () => $scope.$apply(() => vm.state = 'playing');
      mediaEl.onpause     = () => $scope.$apply(() => vm.state = 'stopped');

      return mediaEl;
    }

    // The data for the currently playing track
    vm.nowPlaying = null;
    // URL to the current song's cover art
    vm.artworkUrl = defaultArtwork;
    // viewmodel binding for our toggle function
    vm.togglePlayback = togglePlayback;
    // The currently selected station
    vm.station = null;
    // Default audio volume
    vm.audioVolume = 1.0;
    // Change the volume from icon clicks
    vm.changeVolume = changeVolume;
    // Default stream name
    vm.streamName = null;
    // The player's playback state
    vm.state = 'loading';

    let mediaEl = null;
    let streamUrl = '';

    /**
     * We can't actually bind to the volume
     * attr of audio elements, it's a read-once
     * property. Instead, we need to listen for
     * the scope model to change and set the
     * property ourselves
     */
    $scope.$watch(
      () => vm.audioVolume,
      newVal => {
        if(mediaEl) {
          mediaEl.volume = parseFloat(newVal);
        }
      }
    );

    function changeStream(streamName) {
      if(!streamName) return;

      let url = _(vm.station.streams)
        .find(s => s.name === streamName)
        .url;

      streamUrl = url;

      if(mediaEl) {
        mediaEl.setAttribute('src', streamUrl);
      }

      loadNowPlaying();
    }

    /**
     * <md-select> doesn't currently let us track
     * options by custom values, so we can only use
     * displayed value, in this case the stream name.
     * Because of this, we have to do some sorcery
     * to actually change stream URLs.
     */
    $scope.$watch(
      () => vm.streamName,
      newVal => changeStream(newVal)
    );

    // Set up a regular "Now Playing" data refresh interval and store the $interval token for later disposal
    let refreshData = $interval(function(){
      if(vm.isPlaying) {
        loadNowPlaying();
      }
    }, 1000);

    /**
     * Given the current state of the audio element,
     * toggle it. As this is a radio, we also want to
     * seek to the end of the buffer when we start playing
     * again.
     */
    function togglePlayback() {
      if(mediaEl) {
        stopStream();
      } else {
        startStream();
      }
    }

    function startStream() {
      stopStream();
      if(!mediaEl) {
        mediaEl = createMediaEl();
        $element.append(mediaEl);
      }
      mediaEl.setAttribute('src', streamUrl);
      vm.isLoading = true;
    }

    function stopStream() {
      if(mediaEl) {
        mediaEl.pause();
        angular.element(mediaEl).remove();
        mediaEl = null;

        vm.isPlaying = false;
        vm.isLoading = false;
      }
    }

    /**
     * Changes the volume of the media element
     * by a given delta, clamped into valid ranges.
     *
     * @param {Number} A float to change the value by
     */
    function changeVolume(delta) {
      let result = vm.audioVolume + delta;
      if(result < 0) {
        vm.audioVolume = 0;
      } else if(result > 1) {
        vm.audioVolume = 1;
      } else {
        vm.audioVolume = result;
      }
    }

    /**
     * Multiple streams means multiple options
     * for now-playing data. As such, we need
     * a central way to load this so our interval
     * and station listeners can both load it
     * cleanly.
     */
    function loadNowPlaying(datum) {
      let source = datum || playingCache[vm.station.shortcode];

      let history = _(source.streams)
        .find(d => d.name === vm.streamName);

      let externalData = history.current_song.external,
          url = defaultArtwork;

      /**
       * PVL offers external data that might provide
       * cover artwork for the track. If that exists,
       * parse it and load it into the model object
       * such that the view can load it.
       */
      if(externalData) {
        if(externalData.bronytunes) {
          url = externalData.bronytunes.image_url || url;
        }
      }

      vm.nowPlaying = history;
      vm.artworkUrl = url;
    }

    /**
     * Listen to the event bus and update the station to
     * be the one the user selected elsewhere in the application.
     * Also updates the nowPlaying to match the current station
     * if the cache exists.
     */
    let stationListener = (evt, station) => {
      vm.station = station;
      vm.streamName = _(station.streams)
          .find(s => s.id === station.default_stream_id).name;
      changeStream(vm.streamName);
      loadNowPlaying();
      startStream();
    };

    /**
     * Listen to the event bus and update the nowPlaying
     * metadata and cache.
     */
    let nowPlayingListener = (evt, data) => {
      playingCache = data;

      if(!vm.station) return;

      let datum = data[vm.station.shortcode];
      loadNowPlaying(datum);
    };

    // Listen to station selections on the event bus
    var unsubStationSelect  = EventBus.on('pvl:stationSelect', stationListener);
    // Listen for nowPlaying data
    var unsubNowPlaying     = EventBus.on('pvl:nowPlaying', nowPlayingListener);

    // If our scope is ever destroyed, stop listening to the event bus
    $scope.$on('$destroy', () => {
      $interval.cancel(refreshData);
      unsubStationSelect();
      unsubNowPlaying();
    });
  }

  function MediaPlayerDirective() {
    return {
      restrict: 'E',
      templateUrl: '/mediaPlayer.html',
      scope: true,
      controller: MediaPlayerCtrl,
      controllerAs: 'mediaPlayer',
      bindToController: true
    };
  }

  angular
    .module(module.name)
    .directive('pvlMediaPlayer', MediaPlayerDirective);
}

