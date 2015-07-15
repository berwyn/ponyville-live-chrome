/// <reference path="../tsd.d.ts" />

import { Station } from '../Models';
import { StationStore } from '../stores/StationStore';
import StationActions from '../actions/StationActions';

export class StationGrid {
	
	static $inject = [
		'StationStore'
	];
	
	type: string;
	selected: number;
	
	private stations: Station[];
	
	constructor(private store: StationStore, 
				private actions: StationActions) {
		this.populateStations();
		this.store.listen(this.type)
			.subscribe(() => this.populateStations);
	}
	
	stationClicked(station: Station) {
		this.selected = this.stations.indexOf(station);
		this.actions.signal(StationActions.StationSelected, station);
	}
	
	private populateStations() {
		this.stations = this.type === 'audio' ? this.store.audio : this.store.video;
	}
}

export default function StationGridDirective(): angular.IDirective {
	return {
		restrict: 'E',
		scope: {
			type: '@'
		},
		controller: StationGrid,
		controllerAs: 'grid',
		bindToController: true,
	}
}