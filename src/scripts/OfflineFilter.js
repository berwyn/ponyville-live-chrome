/** ngInject */
function offlineFilter() {
	return input => input? input : '[OFFLINE]';
}

angular
	.module('PVL')
	.filter('offline', offlineFilter);