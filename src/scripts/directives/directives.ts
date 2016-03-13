import { PvlMarquee } from './marquee';
import { ShowList } from './showList';
import { StationList } from './stationList';
import { MediaPlayer } from './mediaPlayer';

export var DirectivesModule = angular
    .module('pvl-directives', [])
    .directive('pvlMarquee', PvlMarquee)
    .directive('pvlShowList', ShowList)
    .directive('pvlStationList', StationList)
    .directive('pvlMediaPlayer', MediaPlayer);