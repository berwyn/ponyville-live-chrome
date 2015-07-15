/// <reference path="tsd.d.ts" />

export class PVLConfiguration {
	
	private $compileProvider: angular.ICompileProvider;
	private $mdThemingProvider;
	private $mdIconProvider;
	
	/* ngInject */
	constructor($compileProvider, $mdThemingProvider, $mdIconProvider) {
		$compileProvider
	    .imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);
	
	  $mdThemingProvider.theme('default')
	  	.primaryPalette('indigo')
	  	.accentPalette('orange');
		  
	  $mdIconProvider
	  	.iconSet('av', 'svg/svg-sprite-av.svg', 24);
	}
}