import { PvlService } from './pvl';
import { EventBus } from './eventbus';

export var ServiceModule = angular
    .module('pvl-services', [])
    .service('PvlService', PvlService)
    .service('EventBus', EventBus);