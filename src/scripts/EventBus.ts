/// <reference path="tsd.d.ts" />

export class EventBus {
	
	private $rootScope: angular.IScope;
	
	constructor($rootScope) {
		this.$rootScope = $rootScope;
	}
	
	on(evtName: string, cb: (listener: angular.IAngularEvent, args: any[]) => any) {
		return this.$rootScope.$on(evtName, cb);
	}
	
	emit(evtName: string, payload: any) {
		this.$rootScope.$emit(evtName, payload);
	}
}