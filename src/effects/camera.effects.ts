import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AlertController } from 'ionic-angular';
import map from 'lodash/map';
import { Observable } from 'rxjs/Rx';
import { CameraActions } from '../actions/camera.actions';
import { NavigationActions } from '../actions/navigation.actions';
import { PotentialActions } from '../actions/potential.action';
import { IAppState } from '../reducers';
import { CameraService } from '../services/camera.service';
import { LoadingService } from '../services/loader.service';
import { UserActions } from './../actions/user.actions';


@Injectable()
export class CameraEffects {
    private cameraPayload: any;
    constructor(
        private actions$: Actions,
        private service: CameraService,
        private loaderService: LoadingService,
        private cameraActions: CameraActions,
        private navs: NavigationActions,
        private CustomAlert: AlertController,
        private potentialActions: PotentialActions,
        private store: Store<IAppState>,
        private userActions: UserActions
    ) { }

    showAlert = (message: string, title: string) => {
        let alert = this.CustomAlert.create({
            message: message,
            title: title,
            enableBackdropDismiss: false,
            cssClass: 'custum_alert',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    // alert.dismiss();
                }
            }]
        });
        alert.present();
    }

    // PRO-VIGIL  start
    @Effect() saveCameras$ = this.actions$
        .ofType(CameraActions.FETCH_CAMERAS)
        .mergeMap((payload) => {
            this.cameraPayload = payload.payload;
            return this.service.fetchCameras(payload);
        })
        .do(response => {
            response['status'] = 200;
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if ((response !== 'Network Error') && (response.status == 200)) {
                let data = {};
                if(window.localStorage.isPvmUser === 'true') {
                    data[this.cameraPayload.potentialid] = [];
                    map(response, (response: any) => {
                        data[this.cameraPayload.potentialid].push(response);
                    })
                } else {
                    data[this.cameraPayload.potentialId] = [];
                    map(response, (response: any) => {
                        data[this.cameraPayload.potentialId].push(response);
                    })
                }
                this.store.dispatch(this.cameraActions.activeCamera({}));
                this.store.dispatch(this.cameraActions.saveCameras(data));
            } 
            else {
                    this.showAlert('Unexpected error occured', 'Error');
                    return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured', 'Error');
            return Observable.of('Network Error');
        });


      // PRO-VIGIL  start
    @Effect() authenticateCameras$ = this.actions$
    .ofType(CameraActions.AUTHENTICATE_CAMERA)
    .mergeMap((payload) => {
        this.cameraPayload = payload.payload;
        return this.service.authenticateCameras(payload);
    })
    .do(response => {
        if (response && response === 'LOG OUT') {
            this.store.dispatch(this.userActions.logout());
            window.location.pathname = '/';
            return Observable.of('Network Error');
        }

        if ((response !== 'Network Error' && !response.error) && (response.status === 200)) {
            this.store.dispatch(this.cameraActions.activeCamera({}));
        } 
        else {
                this.showAlert('Unexpected error occured', 'Error');
                return Observable.of('Network Error');
                       
        }
    })
    .catch((error) => {
        this.showAlert('Unexpected error occured', 'Error');
        return Observable.of('Network Error');
    });


        @Effect() saveSureviewCameras$ = this.actions$
        .ofType(CameraActions.FETCH_SURVIEW_CAMERAS)
        .mergeMap((payload) => {
            this.cameraPayload = payload.payload;
            return this.service.fetchSurviewCameras(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if ((response !== 'Network Error' && !response.error) && (response.status == 200)) {
                let data = {};
                data[this.cameraPayload.potentialid] = [];
                map(response, (response: any) => {
                    data[this.cameraPayload.potentialid].push(response);
                })
                // this.store.dispatch(this.cameraActions.activeCamera(data[this.cameraPayload.potentialid][0]));
                this.store.dispatch(this.cameraActions.saveCameras(data));
            } 
            else {
                    this.showAlert('Unexpected error occured', 'Error');
                    return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured.', 'Error');
            return Observable.of('Network Error');
        });

        @Effect() liveUrl$ = this.actions$
        .ofType(CameraActions.LIVE_URL)
        .mergeMap((payload) => {
            let livePayload = payload.payload;
            let temp = this.service.getLiveUrl(livePayload);
            return this.service.getLiveUrl(livePayload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if ((response !== 'Network Error' && !response.error) && (response.status == 200)) {
                // this.store.dispatch(this.cameraActions.liveUrl(response));
                let liveUrl = response.live_streaming && response.live_streaming.liveurl || '';
                this.store.dispatch(this.cameraActions.liveUrlSuccess(liveUrl));
                let payload = {
                    desktop: false,
                    liveUrl: liveUrl
                }
                this.store.dispatch(this.cameraActions.playLive(payload));
            } 
            else {
                    this.showAlert('Unexpected error occured.', 'Error');
                    return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured.', 'Error');
            return Observable.of('Network Error');
        });

        @Effect() liveUrlRtmp$ = this.actions$
        .ofType(CameraActions.LIVE_URL_RTMP)
        .mergeMap((payload) => {
            let livePayload = payload.payload;
            //let temp = this.service.getLiveUrlRtmp(livePayload);
            return this.service.getLiveUrlRtmp(livePayload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if ((response !== 'Network Error' && !response.error) && (response.status == 200)) {
                // this.store.dispatch(this.cameraActions.liveUrl(response));
                let liveUrl = response.streaming_server_url;//response.liveurl//response.streaming_server_url;//.liveurl;//response.live_streaming && response.live_streaming.liveurl || '';
               window.localStorage.rtmpurl=liveUrl;
               // this.store.dispatch(this.cameraActions.liveUrlSuccessRtmp(liveUrl));
                let payload = {
                    desktop: false,
                    liveUrl: liveUrl
                }
               // let video_token = liveUrl.split('/', 5)[4];
                let rtmpURL= liveUrl;
               // alert(rtmpURL);
                (<any>window).VideoPlayerVLC.play(
                    rtmpURL,
                                            done => { 
                                                if(window.localStorage.rtmpstreamapidata!==null && typeof(window.localStorage.rtmpstreamapidata)!=='undefined')
                                                {  
                                                    let rtmpInfo = JSON.parse(window.localStorage.rtmpstreamapidata);
                                                   let payload = {};
                                                   payload["user"]= rtmpInfo.user;
                                                   payload["local_camera_id"]=JSON.parse(rtmpInfo.body).local_camera_id;//'{"local_camera_id":"'+item.localcameraID+'"}';
                                                   payload["Authorization"]= rtmpInfo.Authorization;  
                                                   this.store.dispatch(this.cameraActions.deleteLiveRtmpStream(payload));
                                                   window.localStorage.rtmpstreamapidata=null;
                                                }
                                             
                                             },
                                            error => {  }
                                       );                
               // this.store.dispatch(this.cameraActions.playLiveRtmp(payload));
            } 
            else {
                
                    this.showAlert('Unexpected error occured.', 'Error');
                    return Observable.of('Network Error');
             
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured.'+error, 'Error');
            return Observable.of('Network Error');
        });
        @Effect() deleteLiveRtmpStream$ = this.actions$
        .ofType(CameraActions.DELETE_LIVE_RTMP_STREAM)
        .mergeMap(action => this.service.deleteLiveRtmpStream(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (result && (result.status === 200 || result.status === 204) ){
                //alert('Stream Deleted');
            
            } else if (result === 'Network Error') {
            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });
        @Effect() ptzActions$ = this.actions$
        .ofType(CameraActions.PTZ_ACTIONS)
        .mergeMap(action => this.service.ptzActions(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (result && result.status === 200) {
          
             window.localStorage.liveStreamURL=JSON.stringify(result);//JSON.stringify(result['live_streaming'].liveurl).replace(/^"(.*)"$/, '$1');
            } else if (result === 'Network Error') {
            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });
}
