import { Action, ActionReducer } from '@ngrx/store';
import { UserActions } from '../actions/user.actions';
import { VideoActions } from '../actions/video.action';
import { VideoList } from '../models/user';




export interface IvideoState {
    video: any;
    videoList: any;
}

export const VideoReducer: ActionReducer<VideoList> =
    (state: VideoList, action: Action) => {
        switch (action.type) {
            case VideoActions.VIDEOS_SUCCESS:
                return Object.assign({}, state, { video: action.payload.SiteStatistics.Events });
                case VideoActions.VIDEOS_LIST_SUCCESS:
                return Object.assign({}, state, { videoList: action.payload });
            case UserActions.LOGOUT:
                return Object.assign({}, state, { video: [] });
            default:
                return state;
        };
    };