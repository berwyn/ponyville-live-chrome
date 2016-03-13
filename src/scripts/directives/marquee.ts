class Marquee {}

export function PvlMarquee(): angular.IDirective {
    return {
        restrict: 'E',
        controller: Marquee,
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            text: '@'
        },
        template: [
            '<p class="pvl-marquee">',
                '<span class="marquee-text">{{ text }}</span>',
            '</p>'
        ].join('')
    };
}