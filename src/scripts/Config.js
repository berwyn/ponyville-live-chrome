export default function(module) {
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
	  .module(module.name)
	  .config(config);
}
