import '@ngrx/core/add/operator/select';
import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { storeLogger } from 'ngrx-store-logger';
import { Navigation } from '../models';
import { ArmStatusReducer, IArmStatusState } from './armstatus.reducer';
import { CameraReducer, ICameraState } from './camera.reducer';
import { EventListReducer, IEventListState } from './eventList.reducer';
import { EventsReducer } from './events.reducer';
import { IMonitorState, MonitorReducer } from './monitor.reducer';
import { NavigationReducer } from './navigation.reducer';
import { IPotentialState, PotentialReducer } from './potential.reducer';
import { IUserState, UsersReducer } from './user.reducer';
import { IvideoState, VideoReducer } from './videos.reducer';
export * from './navigation.reducer';
export * from './user.reducer';


export interface IAppState {
    navigation: Navigation;
    user: IUserState;
    eventList: IEventListState;
    potential: IPotentialState;
    camera: ICameraState;
    video: IvideoState;
    monitor: IMonitorState;
    armStatus: IArmStatusState;
    events: any;

}

export const reducers = {
    navigation: NavigationReducer,
    user: UsersReducer,
    potential: PotentialReducer,
    eventList: EventListReducer,
    camera: CameraReducer,
    events: EventsReducer,
    video: VideoReducer,
    monitor: MonitorReducer,
    armStatus: ArmStatusReducer
}
let store = compose(localStorageSync({
    keys:
    ['user', 'potential', 'eventList', 'events', 'monitor', 'video', 'camera', 'navigation', 'armstatus'],
    rehydrate: true
}), storeLogger(), combineReducers)(reducers);

export default store;
