/// <reference path="../tsd.d.ts" />

import { Stream } from '../Models';

export default class MediaDispatcher {
	
	private subject: Rx.ISubject<Stream>;
	
	constructor() {
		this.subject = new Rx.Subject<Stream>();
	}
	
	listen(): Rx.IObservable<Stream> {
		return this.subject;
	}
	
	publishTo(): Rx.IObserver<Stream> {
		return this.subject;
	}
	
}