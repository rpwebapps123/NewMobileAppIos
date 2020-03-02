import { Action, ActionReducer } from '@ngrx/store';
import { MonitorActions } from '../actions/monitor.actions';
import { UserActions } from '../actions/user.actions';


export interface IMonitorState {
    // userData: LoginData;
    // current: any;
    // IsLoggedin: boolean;
    // ErrorMessage: string;
    // MonitorData: any;
    current: any;
    MonitorHoursData: any;
    MonitoringStatusData: any;
    MonitoringUnitData: any;
}

const intitiState: IMonitorState = {
    current: {},
    MonitorHoursData: {},
    MonitoringStatusData: {},
    MonitoringUnitData: {}
}
export const MonitorReducer: ActionReducer<IMonitorState> =
    (state: IMonitorState = intitiState, action: Action) => {
        switch (action.type) {
            case MonitorActions.MONITOR_HOURS_SUCCESS:
                return Object.assign({}, state, {
                    MonitorHoursData: action.payload
                });
            case MonitorActions.MONITORING_STATUS_SUCCESS: {
                if (typeof action.payload === 'object') {
                    return Object.assign({}, state, {
                        MonitoringStatusData: action.payload
                    });
                }else{
                    return state;
                }
            }
            case MonitorActions.MONITORING_UNIT_SUCCESS:
                return Object.assign({}, state, {
                    MonitoringUnitData: action.payload
                });
            case UserActions.LOGOUT:
                return Object.assign({}, state, {
                    current: {},
                    MonitorHoursData: {},
                    MonitoringStatusData: {},
                    MonitoringUnitData: {}
                });
            default:
                return state;
        };
    };