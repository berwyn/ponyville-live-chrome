export default function(module) {
	/** ngInject **/
	function config($compileProvider) {
	  $compileProvider
	    .imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);
	}

	angular
	  .module(module.name)
	  .config(config);
}
