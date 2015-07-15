/// <reference path="../tsd.d.ts" />

import { Station } from '../Models';
import StationDispatcher  from '../dispatchers/StationDispatcher';
import MediaDispatcher from '../dispatchers/MediaDispatcher';

export default class StationActions {
	static StationSelected = "selected";
	
	static $inject = [
		'StationDispatcher',
		'MediaDispatcher'
	];
	
	constructor(private stationDispatcher: StationDispatcher,
				private mediaDispatcher: MediaDispatcher) {}
	
	signal(evt: string, ...args: Station[]) {
		switch(evt) {
			case StationActions.StationSelected:
				let sIndex = args[0].streams
					.map(s => s.id === args[0].default_stream_id)
					.indexOf(true);
				
				this.mediaDispatcher.publishTo()
					.onNext(args[0].streams[sIndex]);
		}
	}
}