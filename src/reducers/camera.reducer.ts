import { Action, ActionReducer } from '@ngrx/store';
import { CameraActions } from '../actions/camera.actions';
import { CameraList } from '../models/user';
import { UserActions } from './../actions/user.actions';


export interface ICameraState {
    List: { [potentialID: string]: Array<CameraList> };
    ActiveCamera: CameraList;
    LiveUrl: string;
    HideHeader: boolean;
    isRefresh: false;
    Title: string;
}

export const CameraReducer: ActionReducer<any> =
    (state: any, action: Action) => {
        switch (action.type) {

            case CameraActions.REFRESH_CAMERA:
                return Object.assign({}, state, {
                    isRefresh: true
                });
            case CameraActions.SAVE_CAMERAS_LIST:
                return Object.assign({}, state, {
                    List: action.payload
                });
            case CameraActions.ACTIVE_CAMERA:
                return Object.assign({}, state, {
                    ActiveCamera: action.payload
                });
            case CameraActions.LIVE_URL_SUCCESS:
                return Object.assign({}, state, {
                    LiveUrl: action.payload

                });
            case CameraActions.HIDE_HEADER:
                return Object.assign({}, state, {
                    HideHeader: action.payload

                });
            case CameraActions.SET_HEADER:
                return Object.assign({}, state, {
                    Title: action.payload

                }); 
            case CameraActions.PLAY_LIVE:
                if (action.payload.sdUrl) {
                    if (action.payload.desktop) {
                        let video_token = action.payload.liveUrl.split('/', 5)[4];
                        document.getElementById('player').innerHTML = '';
                        let player = "hdwplayer({ id: 'player', swf: 'player/player.swf', width: '65%', height: '400', type: 'rtmp', streamer: 'rtmp://rtmp.camio.com/live', video: video_token})"
                        eval(player);
                    } else {
                        let sdUrl = action.payload.sdUrl.toString();
                        let hdUrl = action.payload.hdUrl.toString();

                        // (window as any).VideoPlayerVLC.play(
                        //     // action.payload.liveUrl.toString() +  ',' + state.ActiveCamera.Name.toString(),
                        //     [sdUrl, hdUrl, action.payload.name],
                        //     done => {
                        //         console.log('done success ===>')
                        //         // alert('success')
                        //     },
                        //     error => {
                        //         console.log('error')
                        //         // alert('error')
                        //     }
                        // );
                    }
                } else {
                    let alert = this.CustomAlert.create({
                        message: "Live view not available",
                        title: 'ERROR',
                        enableBackdropDismiss: false,
                        cssClass: 'custum_alert',
                        buttons: [{
                            text: 'Ok'
                            // handler: () => {
                            //     // alert.dismiss();
                            // }
                        }]
                    });
                    alert.present();
                }
                return Object.assign({}, state, {
                    LiveUrl: action.payload

                });
            case UserActions.LOGOUT:
                return Object.assign({}, state, {
                    List: {},
                    ActiveCamera: undefined

                });


            default:
                return state;
        };
    };