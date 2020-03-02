import { ArmStatusActions } from './armstatus.actions';
import { CameraActions } from './camera.actions';
import { CameraHealthActions } from './camerahealth.action';
import { EventListAction } from './eventList.action';
import { EventsActions } from './events.action';
import { MonitorActions } from './monitor.actions';
import { NavigationActions } from './navigation.actions';
import { PotentialActions } from './potential.action';
import { StatsActions } from './stats.actions';
import { UserActions } from './user.actions';
import { VideoActions } from './video.action';

export { UserActions, NavigationActions, PotentialActions, EventListAction, CameraActions, StatsActions, VideoActions, MonitorActions, EventsActions, CameraHealthActions, ArmStatusActions };

export default [
    UserActions,
    NavigationActions,
    PotentialActions,
    EventListAction,
    CameraActions,
    MonitorActions,
    EventsActions,
    StatsActions,
    VideoActions,
    MonitorActions,
    CameraHealthActions,
    ArmStatusActions
];