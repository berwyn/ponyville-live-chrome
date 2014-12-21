/** ngInject **/
function MainCtrl() {
  var vm = this,
      version = chrome.runtime.getManifest().version,
      beta = true; // TODO: Figure out a better scheme for this?

  vm.appVersion = version + (beta? '_BETA' : '');
}

angular
  .module('PVL')
  .controller('MainCtrl', MainCtrl);