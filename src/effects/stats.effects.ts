import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { StatsActions } from '../actions/stats.actions';
import { UserActions } from '../actions/user.actions';
import { IAppState } from '../reducers';
import { LoadingService } from '../services/loader.service';
import { StatsService } from '../services/stats.service';




@Injectable()
export class StatsEffects {

    constructor(
        private actions$: Actions,
        private service: StatsService,
        private userActions: UserActions,
        private store: Store<IAppState>,
        private CustomAlert: AlertController,
        private loaderService: LoadingService,
        private statsActions: StatsActions
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

  @Effect() fetchCurrentStats$ = this.actions$
        .ofType(StatsActions.GET_CURRENT_STATS_LIST)
        .mergeMap(action => this.service.getStatsList(action.payload))
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (response && ((response.status).trim() === '200'))
            {
                this.store.dispatch(this.statsActions.currentStatsSuccess(response));
            } else if ( (response.status).trim() !== '200') {
                this.showAlert(response.message, 'Error');
            } else {
                    this.showAlert('Unexpected error occured.', 'Error');
                    return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured.', 'Error');
            return Observable.of('Network Error');
        }); 

        @Effect() fetchHistoryStats$ = this.actions$
        .ofType(StatsActions.GET_HISTORY_STATS_LIST)
        .mergeMap(action => this.service.getStatsList(action.payload))
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (response && ((response.status).trim() === '200'))
            {
                this.store.dispatch(this.statsActions.historyStatsSuccess(response));
            } else if ( (response.status).trim() !== '200') {
                this.showAlert(response.message, 'Error');
            } else {
                    this.showAlert('Unexpected error occured.', 'Error');
                    return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured.', 'Error');
            return Observable.of('Network Error');
        }); 

        @Effect() fetchClipsStats$ = this.actions$
        .ofType(StatsActions.GET_CLIPS_STATS_LIST)
        .mergeMap(action => this.service.getStatsList(action.payload))
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (response && ((response.status).trim() === '200'))
            {
                this.store.dispatch(this.statsActions.clipsStatsSuccess(response));
            } else if ( (response.status).trim() !== '200') {
                this.showAlert(response.message, 'Error');
            } else {
                    this.showAlert('Unexpected error occured.', 'Error');
                    return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('Unexpected error occured.', 'Error');
            return Observable.of('Network Error');
        });
}