import { offlineFilter } from './offline';

export var FiltersModule = angular
    .module('pvl-filters', [])
    .filter('offline', offlineFilter);