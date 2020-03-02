import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AlertController } from 'ionic-angular';
import map from 'lodash/map';
import { Observable } from 'rxjs/Rx';
import { CameraActions } from '../actions/camera.actions';
import { CameraHealthActions } from '../actions/camerahealth.action';
import { NavigationActions } from '../actions/navigation.actions';
import { PotentialActions } from '../actions/potential.action';
import { IAppState } from '../reducers';
import { CameraService } from '../services/camera.service';
import { LoadingService } from '../services/loader.service';
import { UserActions } from './../actions/user.actions';


@Injectable()
export class CameraHealthEffects {
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

     //fetch cameras for health status
     @Effect() fetcCameras$ = this.actions$
     .ofType(CameraHealthActions.FETCH_CAMERAS_LIST)
     .mergeMap((payload) => {
         this.cameraPayload = payload.payload;
         return this.service.fetchNetAnalyticsCameras(payload);
     })
     .do(response => {
         if (response && response === 'LOG OUT') {
             this.store.dispatch(this.userActions.logout());
             window.location.pathname = '/';
             return Observable.of('Network Error');
         }

         if ((response !== 'Network Error' && !response.error) && (response.status == 'ok')) {
             let data = {};
             data[this.cameraPayload.potentialid] = [];
             map(response.msg, (response: any) => {
                 data[this.cameraPayload.potentialid].push(response);
             })

            this.store.dispatch(this.cameraActions.activeCamera({}));
            this.store.dispatch(this.cameraActions.saveCameras(data));
         }
         else {
                 this.showAlert(response.msg, 'Alert');
                 return Observable.of('Network Error');
         }
     })
     .catch((error) => {
         this.showAlert('Unexpected error occured', 'Error');
         return Observable.of('Network Error');
     });    

      
}
