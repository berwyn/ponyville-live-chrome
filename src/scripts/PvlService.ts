/// <reference path="tsd.d.ts" />

import { Show, Station, ArrayResponse, MapResponse } from 'Models';

export class PVLService {
  private static apiHost = "https://api.ponyvillelive.com";
  
  private responseTransformer = {
    transformResponse: data => this.cleanPayloadUrls(JSON.parse(data))
  }
  
  private socket: SocketIO.Server;
  private stationCache;
  private showCache;
  
  static $inject = [
    '$http',
    '$q',
    '$sce',
    'io'
  ]
  
  constructor(private $http: angular.IHttpService, 
              private $q: angular.IQService, 
              private $sce: angular.ISCEService, 
              private io: SocketIOStatic) {}
  
  private cleanPayloadUrls(payload) {
    payload.result.forEach(item => {
      item.safeImgUrl = '';
      this.$http
        .get(item.image_url, {responseType: 'blob'})
        .success(res => {
          let fileUrl = URL.createObjectURL(res);
          item.safeImgUrl = this.$sce.trustAsResourceUrl(fileUrl);
        })
        .error(() => item.safeImgUrl = '/images/pvl_128.png');
    });
  }
  
  getStations(type: string): angular.IPromise<Station[]> {
    var deferred = this.$q.defer();
    
    if(this.stationCache[type]) {
      deferred.resolve(this.stationCache[type]);
      return;
    }
    
    this.$http
      .get<ArrayResponse<Show>>(`${PVLService.apiHost}/station/list/category/${type}`, this.responseTransformer)
      .success(json => {
        deferred.resolve(json.result);
        this.stationCache[type] = json.result;
      })
      .error(err => deferred.reject(err));
      
      return deferred.promise;
  }
  
  getShows(): angular.IPromise<Show[]> {
    let deferred = this.$q.defer();
    
    if(this.showCache.length > 0) {
      deferred.resolve(this.showCache);
      return;
    }
    
    this.$http
      .get<ArrayResponse<Show>>(`${PVLService.apiHost}/show/index`, this.responseTransformer)
      .success(res => deferred.resolve(res.result))
      .error(() => deferred.reject(new Error('Request failed')));
      
    return deferred.promise;
  }
  
  getNowPlaying() {
    if(!this.socket) {
      this.socket = this.io('wss://api.ponyvillelive.com', {path: '/live'});
    }
    return this.socket;
  }
}