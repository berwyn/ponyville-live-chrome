/** ngInject **/
function MainCtrl(PvlService) {
  var vm = this,
      app_version = angular.module('PVL').value('app_version'),
      app_beta = angular.module('PVL').value('app_beta');

  vm.appVersion = app_version + (app_beta? '_BETA' : '');
}

angular
  .module('PVL')
  .controller('MainCtrl', MainCtrl);