import { Action, ActionReducer } from '@ngrx/store';
import { ArmStatusActions } from '../actions/armstatus.actions';


export interface IArmStatusState {
    MonitoringStatusData: any;
    armDisArmInfo: any;
    siteStatus?: number;
}

const intitiState: IArmStatusState = {
    MonitoringStatusData : {},
    armDisArmInfo: {}
}

export const ArmStatusReducer: ActionReducer<IArmStatusState> =
    (state: IArmStatusState = intitiState, action: Action) => {
        switch (action.type) {
            case ArmStatusActions.SAVE_ARM_DISARM_INFO: {
                let newState = JSON.parse(JSON.stringify(state));
                newState.armDisArmInfo = action.payload.armDisArmHistory || action.payload.reverseEscalations;
                newState.MonitoringStatusData = action.payload.monitoringstatus || action.payload.monitoringStatus;
                newState.onlineText = action.payload.onlineText;
                newState.onlineStatus = action.payload.onlineStatus;
                return newState;
            }
            case ArmStatusActions.DISARM_CAMERA_SUCCESS: {
                let newState = JSON.parse(JSON.stringify(state));
                newState.armCamera = false;
                newState.MonitoringStatusData = {status : action.payload.status};
                newState.siteStatus = action.payload.status;
                newState.armDisArmInfo = action.payload.armDisArmHistory;
                return newState;
            };
            case ArmStatusActions.ARM_CAMERA_SUCCESS: {
                let newState = JSON.parse(JSON.stringify(state));
                newState.armCamera = true;
                newState.MonitoringStatusData = {status : action.payload.status};
                newState.siteStatus = action.payload.status;
                newState.armDisArmInfo = action.payload.armDisArmHistory;
                return newState;
            };
            case ArmStatusActions.GET_SITE_STATUS_SUCCESS: {
                let newState = JSON.parse(JSON.stringify(state));
                newState.siteStatus = action.payload.status;
                return newState;
            };
            default:
                return state;
        };
    };