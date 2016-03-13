/** @ngInject **/
export function EventBus($rootScope) {
    function emit(evtName, payload) {
        $rootScope.$emit(evtName, payload);
    }

    function on(evtName, cb) {
        return $rootScope.$on(evtName, cb);
    }

    return { emit, on };
}