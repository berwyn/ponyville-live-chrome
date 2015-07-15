/// <reference path="tsd.d.ts" />

import { PVLService } from 'PvlService';
import { Show } from 'Models';

export class ShowList {
  
  private shows: Show[];
  
  /* ngInject */
  constructor(pvlService: PVLService) {
    pvlService.getShows()
      .then(shows => this.shows = shows);
  }
  
}

export function ShowListDirective(): angular.IDirective {
  return {
    restrict: 'E',
    templateUrl: '/showList.html',
    scope: true,
    controller: ShowList,
    controllerAs: 'showList',
    bindToController: true
  }
}