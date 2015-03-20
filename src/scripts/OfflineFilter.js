export default function(module) {
	/** ngInject */
	function offlineFilter() {
		return input => input? input : '[OFFLINE]';
	}

	angular
		.module(module.name)
		.filter('offline', offlineFilter);
}