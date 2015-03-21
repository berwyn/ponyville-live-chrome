export default function(module) {

  /** ngInject **/
  function ShowListCtrl(PvlService) {
    let vm = this;

    vm.shows = [];

    PvlService.getShows()
      .then(shows => vm.shows = shows);
  }

  function ShowListDirective() {
    return  {
      restrict: 'E',
      templateUrl: '/showList.html',
      scope: true,
      controller: ShowListCtrl,
      controllerAs: 'showList',
      bindToController: true
    };
  }

    angular
      .module(module.name)
      .directive('pvlShowList', ShowListDirective);
}