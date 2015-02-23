/* global chrome */
/** ngInject **/
function MainCtrl(PvlService, $rootScope) {
  let vm = this,
      version = chrome.runtime.getManifest().version,
      beta = true; // TODO: Figure out a better scheme for this?

  vm.appVersion = version + (beta? '_BETA' : '');

  PvlService
  	.getNowPlaying()
  	.on('nowplaying', data => $rootScope.$emit('pvl:nowPlaying', data));
}

angular
  .module('PVL')
  .controller('MainCtrl', MainCtrl);