import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { CameraList } from '../models/user';


@Injectable()
export class CameraActions {

    static FETCH_CAMERAS = 'FETCH_CAMERAS';
    fetchCameras(cameraDetails: any): Action {
        return {
            type: CameraActions.FETCH_CAMERAS,
            payload: cameraDetails
        };
    }

    static AUTHENTICATE_CAMERA = 'AUTHENTICATE_CAMERA';
    authenticateCamera(cameraDetails: any): Action {
        return {
            type: CameraActions.AUTHENTICATE_CAMERA,
            payload: cameraDetails
        };
    }

    static FETCH_SURVIEW_CAMERAS = 'FETCH_SURVIEW_CAMERAS';
    fetchSureviewCameras(cameraDetails: any): Action {
        return {
            type: CameraActions.FETCH_SURVIEW_CAMERAS,
            payload: cameraDetails
        };
    }

    static SAVE_CAMERAS_LIST = 'SAVE_CAMERAS_LIST';
    saveCameras(cameraList: any): Action {
        return {
            type: CameraActions.SAVE_CAMERAS_LIST,
            payload: cameraList
        };
    }

    static ACTIVE_CAMERA = 'ACTIVE_CAMERA';
    activeCamera(cameraList: CameraList): Action {
        return {
            type: CameraActions.ACTIVE_CAMERA,
            payload: cameraList
        };
    }

    static REFRESH_CAMERA = 'REFRESH_CAMERA';
    refreshCamera(): Action {
        return {
            type: CameraActions.REFRESH_CAMERA
        };
    }

    static LIVE_URL = 'LIVE_URL';
    liveUrl(camera: any): Action {
        return {
            type: CameraActions.LIVE_URL,
            payload: camera
        };
    }
    static LIVE_URL_SUCCESS = 'LIVE_URL_SUCCESS';
    liveUrlSuccess(url: any): Action {
        return {
            type: CameraActions.LIVE_URL_SUCCESS,
            payload: url
        };
    }
    static PLAY_LIVE = 'PLAY_LIVE';
    playLive(payload: any): Action {
        return {
            type: CameraActions.PLAY_LIVE,
            payload: payload
        };
    }

    static HIDE_HEADER = 'HIDE_HEADER';
    hideHeader(isHide: boolean): Action {
        return {
            type: CameraActions.HIDE_HEADER,
            payload: isHide
        };
    }
    
    static SET_HEADER = 'SET_HEADER';
    setHeader(title: string): Action {
        return {
            type: CameraActions.SET_HEADER,
            payload: title
        };
    }
}