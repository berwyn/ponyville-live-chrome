import { ControllersModule } from './controllers/controllers';
import { ServiceModule } from './services/services';
import { FiltersModule } from './filters/filters';
import { DirectivesModule } from './directives/directives';

let modules = [
    'ngAnimate',
    'ngMaterial',
    ControllersModule.name,
    ServiceModule.name,
    FiltersModule.name,
    DirectivesModule.name
];

/** ngInject **/
function config($compileProvider, $mdThemingProvider, $mdIconProvider) {
    $compileProvider
        .imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);

    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('orange');

    $mdIconProvider
        .iconSet('av', 'svg/svg-sprite-av.svg', 24);
}

angular
    .module('PVL', modules)
    .config(config)
    .constant('io', io)
    .constant('jQuery', $)
    .constant('moment', moment)
    .constant('_', _)
    .constant('ColorThief', ColorThief);