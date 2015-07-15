/// <reference path="../tsd.d.ts" />

import { Station } from '../Models';

export default class StationDispatcher  {
	
	private subject: Rx.ISubject<Station>;
	private arraySubject: Rx.ISubject<Station[]>;
	
	constructor() {
		this.subject = new Rx.Subject<Station>();
		this.arraySubject = new Rx.Subject<Station[]>();
	}
	
	listen(): Rx.IObservable<Station> {
		return this.subject;
	}
	
	listenAll(): Rx.IObservable<Station[]> {
		return this.arraySubject;
	}
	
	publishTo(): Rx.IObserver<Station> {
		return this.subject;
	}
	
	publishAll(): Rx.IObserver<Station[]> {
		return this.arraySubject;
	}
	
}