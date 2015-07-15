/// <reference path="tsd.d.ts" />

export interface Show {
	id: number
	name: string
	shortcode: string
	genre: string
	category: string
	type: string
	image_url?: string
	web_url?: string
	stream_url?: string
	twitter_url?: string
	irc?: string
}

export interface Station {
	id: number
	name: string
	shortcode: string
	genre: string
	category: string
	type: string
	image_url?: string
	web_url?: string
	stream_url?: string
	twitter_url?: string
	irc?: string
	offline?: boolean
	streams: Stream[]
	default_stream_id: number
}

export interface Stream {
	id: number
	name: string
	url: string
	type: string
	is_default: boolean
}

export interface ArrayResponse<T> {
	status: string
	result?: T[]
}

export interface MapResponse<T> {
	status: string
	result?: {[key: string]: T}
}