/// <reference path="../tsd.d.ts" />

import { Station } from '../Models';
import StationDispatcher from '../dispatchers/StationDispatcher';

export class StationStore {
	
	static $inject = [
		'StationDispatcher'
	];
	
	private audioStations: Station[];
	private videoStations: Station[];
	private subjects: {[type: string]: Rx.ISubject<void>}
	
	get audio() { return this.audioStations; }
	get video() { return this.videoStations; }
	
	constructor(stationDispatcher: StationDispatcher) {
		this.subjects = {
			'audio': new Rx.Subject<void>(),
			'video': new Rx.Subject<void>()
		};
		
		stationDispatcher.listen()
			.subscribe((station: Station) => {
				let arr = station.type === 'audio' ? this.audio : this.video;
				let index = arr.map(s => s.id).indexOf(station.id);
				
				arr.splice(index, 1, station);
				
				this.subjects[station.type].onNext(null);
			});
			
		stationDispatcher.listenAll()
			.subscribe((stations: Station[]) => {
				let type = stations[0].type;
				if(type == 'audio') { this.audio = stations; }
				else { this.video = stations; }
				
				this.subjects[type].onNext(null);
			});
	}
	
	listen(type: string): Rx.IObservable<void> {
		return this.subjects[type];
	}
	
}