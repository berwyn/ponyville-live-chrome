/** ngInject **/
function config($compileProvider) {
  $compileProvider
    .imgSrcSanitizationWhitelist(/^\s*(blob:|data:image)|chrome-extension:/);
}

angular
  .module('PVL')
  .config(config);