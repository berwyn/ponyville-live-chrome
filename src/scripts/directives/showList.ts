/** @ngInject **/
function ShowListCtrl(PvlService) {
    let vm = this;

    vm.shows = [];

    PvlService.getShows()
        .then(shows => vm.shows = shows);
}

export function ShowList() {
    return {
        restrict: 'E',
        templateUrl: '/showList.html',
        scope: true,
        controller: ShowListCtrl,
        controllerAs: 'showList',
        bindToController: true
    };
}