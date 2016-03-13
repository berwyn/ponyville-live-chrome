/** @ngInject */
export function offlineFilter() {
    return input => input ? input : '[OFFLINE]';
}