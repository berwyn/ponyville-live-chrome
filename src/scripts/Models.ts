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
	streams: any[]
}

export interface Stream {
	name: string
	current_song?: any
}

export interface ArrayResponse<T> {
	status: string
	result?: T[]
}

export interface MapResponse<T> {
	status: string
	result?: {[key: string]: T}
}