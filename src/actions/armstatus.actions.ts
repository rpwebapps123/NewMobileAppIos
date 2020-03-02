import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class ArmStatusActions {

    
    static GET_ARM_DISARM_STATUS_INFO = 'GET_ARM_DISARM_STATUS_INFO';
    getArmDisArmStatusInfo(info: any): Action {
        return {
            type: ArmStatusActions.GET_ARM_DISARM_STATUS_INFO,
            payload: info
        }
    }

    
    static SAVE_ARM_DISARM_INFO = 'SAVE_ARM_DISARM_INFO';
    saveArmDisArmInfo(info: any): Action {
        return {
            type: ArmStatusActions.SAVE_ARM_DISARM_INFO,
            payload: info
        }
    }

    static LOGOUT = 'LOGOUT';
    logout(): Action {
        return {
            type: ArmStatusActions.LOGOUT
        };
    }

    static GET_ARM_DISARM_INFO = 'GET_ARM_DISARM_INFO';
    getArmDisArmInfo(info: any): Action {
        return {
            type: ArmStatusActions.GET_ARM_DISARM_INFO,
            payload: info
        }
    }
 

    static USER_ARM_CAMERA = 'USER_ARM_CAMERA';
    userArmCamera(data2: any): Action {
        return {
            type: ArmStatusActions.USER_ARM_CAMERA,
            payload: data2
        };
    }

    static ARM_CAMERA_SUCCESS = 'ARM_CAMERA_SUCCESS';
    armCameraSucess(armCamera_sucess: any): Action {
        return {
            type: ArmStatusActions.ARM_CAMERA_SUCCESS,
            payload: armCamera_sucess
        };
    }
    static DISARM_CAMERA_SUCCESS = 'DISARM_CAMERA_SUCCESS';
    disarmCameraSucess(armCamera_sucess: any): Action {
        return {
            type: ArmStatusActions.DISARM_CAMERA_SUCCESS,
            payload: armCamera_sucess
        };
    }
    static GET_SITE_STATUS = 'GET_SITE_STATUS';
    getSiteStatus(payload: any): Action {
        return {
            type: ArmStatusActions.GET_SITE_STATUS,
            payload: payload
        };
    }
    static GET_SITE_STATUS_SUCCESS = 'GET_SITE_STATUS_SUCCESS';
    getSiteStatusSucess(payload: any): Action {
        return {
            type: ArmStatusActions.GET_SITE_STATUS_SUCCESS,
            payload: payload
        };
    }
}