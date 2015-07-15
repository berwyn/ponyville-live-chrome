// export default function(module) {
// 	/* global chrome */
// 	/** ngInject **/
// 	function MainCtrl(PvlService, EventBus) {
// 	  let vm = this,
// 	      version = chrome.runtime.getManifest().version,
// 	      beta = true; // TODO: Figure out a better scheme for this?

// 	  vm.appVersion = version + (beta? '_BETA' : '');
// 	  vm.selection = 'placeholder';

// 	  EventBus.on('pvl:selection', (_, payload) => vm.selection = payload.type);

// 	  PvlService
// 	  	.getNowPlaying()
// 	  	.on('nowplaying', data => EventBus.emit('pvl:nowPlaying', data));
// 	}

// 	angular
// 	  .module(module.name)
// 	  .controller('MainCtrl', MainCtrl);
// }

/// <reference path="tsd.d.ts" />

import { PVLService } from 'PvlService';
import { EventBus } from 'EventBus';

export class MainCtrl {
	private version: string;
	private beta: boolean;
	private pvlService: PVLService;
	private eventBus: EventBus;
	
	/* ngInject */
	constructor(Chrome, PvlService, EventBus) {
		this.pvlService = PvlService;
		this.eventBus = EventBus;
		this.version = Chrome.runtime.getManifest().version;
		this.beta = true;
	}
	
}
