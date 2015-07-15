/// <reference path="tsd.d.ts" />

import { Station } from 'Models';
import { PVLService } from 'PvlService';
import { EventBus } from 'EventBus';

export class StationListCtrl {
  
  static $inject = [
    '$scope',
    '$mdToast',
    'EventBus',
    'PVLService'
  ];
  
  private type: string;
  private stations: Station[];
  private imgUrls: {[s: string]: string};
  private nowPlaying: Station;
  private currentIndex: number;
  
  private nowPlayingListener = (evt, data) => this.nowPlaying = data;
  private unsubNowPlaying: Function;
  
  constructor(private $scope: angular.IScope,
              private $mdToast,
              private eventBus: EventBus,
              private pvlService: PVLService) {
                pvlService.getStations(this.type)
                  .then(stations => this.stations = stations);
                  
                this.unsubNowPlaying = eventBus.on('pvl:nowPlaying', this.nowPlayingListener);
                $scope.$on('$destroy', () => this.unsubNowPlaying()); 
              }
              
  setSelected(index: number) {
    if(this.stations[index].category === 'video') {
      let toast = this.$mdToast.simple()
        .content('Video streams aren\'t current supported :(')
        .capsule(false);
        
      this.$mdToast.show(toast);
      return;
    }
    
    if(this.stations[index].streams.length === 0 || this.stations[index].offline) {
      return;
    }
    
    this.currentIndex = index;
    this.eventBus.emit('pvl:stationSelect', this.stations[index]);
    this.eventBus.emit('pvl:selection', {type: 'audio'});
  }
  
}

export function StationListDirective(): angular.IDirective {
  return {
    restrict: 'E',
    template: '/stationList.html',
    scope: { type: '@' },
    controller: StationListCtrl,
    controllerAs: 'stationList',
    bindToController: true    
  }
}