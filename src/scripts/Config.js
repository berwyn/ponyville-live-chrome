export default function(module) {
	/** ngInject **/
	function config($compileProvider, $mdThemingProvider) {
	  $compileProvider
	    .imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);
	
	  $mdThemingProvider.theme('default')
	  	.primaryPalette('indigo')
	  	.accentPalette('orange');
	}

	angular
	  .module(module.name)
	  .config(config);
}
