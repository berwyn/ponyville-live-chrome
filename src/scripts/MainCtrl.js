export default function(module) {
	/* global chrome */
	/** ngInject **/
	function MainCtrl(PvlService, EventBus) {
	  let vm = this,
	      version = chrome.runtime.getManifest().version,
	      beta = true; // TODO: Figure out a better scheme for this?

	  vm.appVersion = version + (beta? '_BETA' : '');
	  vm.selection = 'placeholder';

	  EventBus.on('pvl:selection', (_, payload) => vm.selection = payload.type);

	  PvlService
	  	.getNowPlaying()
	  	.on('nowplaying', data => EventBus.emit('pvl:nowPlaying', data));
	}

	angular
	  .module(module.name)
	  .controller('MainCtrl', MainCtrl);
}
