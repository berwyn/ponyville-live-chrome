/// <reference path="tsd.d.ts" />

export class OfflineFilter {
	
	/* ngInject */
	constructor(input) {
		return input => input? input : '[OFFLINE]'
	}
}