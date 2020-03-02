import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class VideoActions {
    static VIDEOS_SUCCESS = 'VIDEOS_SUCCESS';
    getvideoSuccess(response: any): Action {
        return {
            type: VideoActions.VIDEOS_SUCCESS,
            payload: response
        };
    }

    static VIDEOS_LIST_SUCCESS = 'VIDEOS_LIST_SUCCESS';
    getvideoListSuccess(response: any): Action {
        return {
            type: VideoActions.VIDEOS_LIST_SUCCESS,
            payload: response
        };
    }
    static GET_VIDEOS = 'GET_VIDEOS';
    getvideos(video:any): Action {
        return {
            type: VideoActions.GET_VIDEOS,
            payload: video
        };
    }
    
}