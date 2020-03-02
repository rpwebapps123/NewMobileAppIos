import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class CameraHealthActions {

   
    static FETCH_CAMERAS_LIST = 'FETCH_CAMERAS_LIST';
    fetchCamerasList(cameraDetails: any): Action {
        return {
            type: CameraHealthActions.FETCH_CAMERAS_LIST,
            payload: cameraDetails
        };
    }

}