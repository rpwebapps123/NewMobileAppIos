import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AlertController } from 'ionic-angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import { ArmStatusActions } from '../actions/armstatus.actions';
import { EventListAction } from '../actions/eventList.action';
import { MonitorActions } from '../actions/monitor.actions';
import { NavigationActions, Pages } from '../actions/navigation.actions';
import { PotentialActions } from '../actions/potential.action';
import { UserActions } from '../actions/user.actions';
import { VideoActions } from '../actions/video.action';
import { PotentialList } from '../models/user';
import { IAppState } from '../reducers';
import { LoadingService } from '../services/loader.service';
import { UserService } from '../services/user.service';
import { SitesActions } from './../actions/sites.action';
import { isDesktop } from './../config/appConfig';
import { Globals } from './../config/globals';
@Injectable()
export class UserEffects {
    private armData: any;
    private payload: any;
    constructor(
        private actions$: Actions,
        private service: UserService,
        private userActions: UserActions,
        private armStatusActions: ArmStatusActions,
        private navs: NavigationActions,
        private potentialActions: PotentialActions,
        private loaderService: LoadingService,
        private videoActions: VideoActions,
        private store: Store<IAppState>,
        private CustomAlert: AlertController,
        private monitorActions: MonitorActions,
        public globals: Globals,
        private sitesActions: SitesActions
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

    showTicketAlert = (message: string, title: string) => {

        let alert = this.CustomAlert.create({
            message: message,
            title: title,
            enableBackdropDismiss: false,
            cssClass: 'custum_alert',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.store.dispatch(this.userActions.setListTicket());
                }
            }]
        });
        alert.present();
    }

    private hideLoader(): void {
        // try {
        //     let loaderObj = document.getElementById('customLoader');
        //     loaderObj.classList.remove('shown');
        // } catch (e) {

        // } finally {

        // }
    }
    // PRO-VIGIL  start
    @Effect() userLogin$ = this.actions$
        .ofType(UserActions.USER_LOGIN)
        .mergeMap(payload =>  { this.payload = payload; return this.service.loginUser(payload); } )
        .do(response => {
            console.log('chari', response);
            console.log("******************** LOGIN-LOG-3 ************************ user.effect.ts inside userLogin effect response "+response);
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout()); 
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
          /* this block for the pvm */
            let responseData = response.data;
            if (responseData && response !== 'Network Error' && (response.status == 200)) {
                this.globals.isPvmUser = true;
                window.localStorage.isPvmUser = 'true';
                console.log("******************** LOGIN-LOG-4 ************************ user.effect.ts inside userLogin effect response.status "+response.status);
                responseData.provigilUserData = JSON.parse(responseData.provigilUserData);
                responseData.provigilUserData.potentialList.map((obj) => {
                    obj.surview = (obj.surview.toLowerCase === 'true');
                })

                // // TODO : This is temporary fix for removing sureview related API'S from application 
                let List: Array<PotentialList> = responseData.provigilUserData.potentialList.filter((item) => !item.surview);
                //checking the potential list exists or not start here
                if(List.length == 0){
                    this.payload.type = 'USER_IVIGIL_LOGIN';
                    this.store.dispatch(this.userActions.userIvigilLogin(this.payload.payload));
                }
                //checking the potential list exists or not end here
                this.store.dispatch(this.potentialActions.savePotentailList(List));
                let activePotentail: any
                let data = List.filter(function (data) {
                    return data.siteName === responseData.lastSite;
                });
                if (responseData.lastSite === '' || responseData.lastSite === null || responseData.lastSite === undefined) {
                    this.store.dispatch(this.potentialActions.activePotentail(List[0]));
                    let activePotentail = List[0];
                    console.log("******************** LOGIN-LOG-5 ************************ user.effect.ts inside userLogin effect responseData.lastSite "+responseData.lastSite);
                    this.store.dispatch(this.userActions.loginSuccess(responseData));
                    console.log('chari-list', List);
                } else if (data === undefined || data.length === 0) {
                    console.log("******************** LOGIN-LOG-6 ************************ user.effect.ts inside userLogin effect data "+data);
                    this.store.dispatch(this.potentialActions.activePotentail(List[0]));
                    let activePotentail = List[0];
                    this.store.dispatch(this.userActions.loginSuccess(responseData));
                } else {
                    console.log("******************** LOGIN-LOG-7 ************************ user.effect.ts inside userLogin effect else ");
                    activePotentail = _.find(List, { potentialId: responseData.lastSite });
                    this.store.dispatch(this.potentialActions.activePotentail(List.length > 0 ? activePotentail : undefined));
                    this.store.dispatch(this.userActions.loginSuccess(responseData));
                }
            /*     if (isDesktop) {
                    this.store.dispatch(this.navs.navigateToPage(Pages.CAMERA));
                    return;
                } */
            } else if (responseData && (response.status == 500)) {
                this.showAlert('We are unable to load your information at this time. Try again.', 'Error');
            } else if (response === 'Network Error') {

            } else if (responseData === 'OK') {
                this.showAlert('Authentication Failed', 'Failure');
            } else if (response === 'Device Offline') {
                this.showAlert('Please check network Connection.', 'Login Failed');
            } else {
                this.payload.type = 'USER_IVIGIL_LOGIN';
                this.store.dispatch(this.userActions.userIvigilLogin(this.payload.payload));
               // this.showAlert('The username or password is incorrect. Try again.', 'Error');
                //this.hideLoader();
            }
        
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });
// I-VIGIL  Login start
@Effect() userIVigilLogin$ = this.actions$
.ofType(UserActions.USER_IVIGIL_LOGIN)
.mergeMap(payload => this.service.loginIvigilUser(payload) )
.do(response => {
    console.log('chari-ivigil', response);
    if (response && response === 'LOG OUT') {
        this.store.dispatch(this.userActions.logout());
        window.location.pathname = '/';
        return Observable.of('Network Error');
    }
    if (response && response === 'LOG OUT') {
        this.store.dispatch(this.userActions.logout()); window.location.pathname = '/';
        return Observable.of('Network Error');
    }

    /* this is for the  Iviging login user */
    let responseData = response;
    if (responseData && response !== 'Network Error' && (!responseData.error) && (response.status == 200)) {
        this.globals.isPvmUser = false;
        window.localStorage.setItem('isPvmUser', 'false');
        responseData.hasPin = true;
        responseData.potentialList.map((obj) => {
            obj.surview = (obj.surview.toLowerCase === 'true');
        })
        let List: Array<PotentialList> = responseData.potentialList.filter((item) => !item.surview);
        this.store.dispatch(this.potentialActions.savePotentailList(List));
        let activePotentail: any
        let data = List.filter(function (data) {
            return data.siteName === responseData.lastSite;
        });
        if (responseData.lastSite === '' || responseData.lastSite === null || responseData.lastSite === undefined) {
            this.store.dispatch(this.potentialActions.activePotentail(List[0]));
            let activePotentail = List[0];
            console.log("******************** LOGIN-LOG-5 ************************ user.effect.ts inside userLogin effect responseData.lastSite "+responseData.lastSite);
            this.store.dispatch(this.userActions.loginSuccess(responseData));
      
        } else if (data === undefined || data.length === 0) {
            console.log("******************** LOGIN-LOG-6 ************************ user.effect.ts inside userLogin effect data "+data);
            this.store.dispatch(this.potentialActions.activePotentail(List[0]));
            let activePotentail = List[0];
            this.store.dispatch(this.userActions.loginSuccess(responseData));
     
        } else {
            console.log("******************** LOGIN-LOG-7 ************************ user.effect.ts inside userLogin effect else ");
            activePotentail = _.find(List, { potentialId: responseData.lastSite });
            this.store.dispatch(this.potentialActions.activePotentail(List.length > 0 ? activePotentail : undefined));                    
            this.store.dispatch(this.userActions.loginSuccess(responseData));
        }

     
    } else if (responseData && (response.status == 500)) {
        this.showAlert('We are unable to load your information at this time. Try again.', 'Error');
    } else if (response === 'Network Error') {

    } else if (responseData === 'OK') {
        this.showAlert('Authentication Failed', 'Failure');
    } else if (response === 'Device Offline') {
        this.showAlert('Please check network Connection.', 'Login Failed');
    } else {

        this.showAlert('The username or password is incorrect. Try again.', 'Error');
        this.hideLoader();
    }
})
.catch((error) => {
    this.showAlert('We are unable to load your information at this time.', 'Error');
    return Observable.of('Network Error');
});
    @Effect() getvideo$ = this.actions$
        .ofType(VideoActions.GET_VIDEOS)
        .mergeMap(payload => this.service.getvideos(payload))
        .do(resObj => {
            if (resObj && resObj === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (resObj && resObj === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }
            if (resObj === 'Network Error') {
                return;
            } else {
                this.store.dispatch(this.videoActions.getvideoListSuccess(resObj));
            }
        }).catch((error) => {

            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });

    @Effect() stateData$ = this.actions$
        .ofType(EventListAction.STATE_DATA)
        .mergeMap(state => this.service.state(state))
        .do(result => {
            // NAVIGATE TO HOME PAGE
            if (result && result === 'LOG OUT') {
                window.location.pathname = '/';
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }
            if ((result !== 'Network Error') && (result.status == 200)) {
                this.store.dispatch({
                    type: EventListAction.GET_STATEDETAILS_SUCESS,
                    payload: result,
                });
            } else if (result === 'Network Error') {

            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        });
    activePotential: any = {}
    @Effect() armCamera$ = this.actions$
        .ofType(ArmStatusActions.USER_ARM_CAMERA)
        .map((action) => { this.activePotential = (action.payload); return action })
        .mergeMap((payload) => {
            console.log(payload, '===========');

            this.armData = payload.payload;
            return this.service.userArmCamera(payload);
        })
        .do(response => {
            console.log(response, '===========');
                if (response && response === 'LOG OUT') {
                    this.store.dispatch(this.userActions.logout());
                    window.location.pathname = '/';

                    return Observable.of('Network Error');
                }
                if ((response !== 'Network Error') && ((response.status).trim() === '200')) {
                    console.log("action ==============", this.armData);

                    if (this.armData.action === 'DEACTIVATE') {
                        response.status = '1';
                        this.store.dispatch(this.armStatusActions.disarmCameraSucess(response));
                        //this.store.dispatch(this.monitorActions.monitorStatusSuccess({ status: '1' })); by chari
                        this.showAlert('Disarming the site until next scheduled monitoring hours', 'Alert');
                    } else {
                        response.status = '0';
                        this.store.dispatch(this.armStatusActions.armCameraSucess(response));
                       // this.store.dispatch(this.monitorActions.monitorStatusSuccess({ status: '0' }));  by chari
                        this.showAlert('Arming the site until next scheduled monitoring hours', 'Alert');
                    }
                    if(window.localStorage.isPvmUser === 'false') {
                        this.store.dispatch(this.armStatusActions.getArmDisArmStatusInfo({
                            fdate: String(new Date().getMonth()) + '/' + (new Date().getDate()  + '/' + new Date().getFullYear()),
                            tdate: String(new Date().getMonth() + 1) + '/' + ((new Date().getDate()) + '/' + new Date().getFullYear()),
                            sitename: this.activePotential.sitename,
                            event: 'MonitoringStatus', potentialid: this.activePotential.potentialId 
                        }));
                    }
                } else if ((response !== 'Network Error') && ((response.status).trim() !== '200')) {
                    this.showAlert(response.response, 'Alert');
                    response.status = '0';
                    this.store.dispatch(this.armStatusActions.disarmCameraSucess(response));
                   // this.store.dispatch(this.monitorActions.monitorStatusSuccess({ status: '0' })); by chari
                } else {
                    this.showAlert('We are unable to load your information at this time.', 'Error');
                    return Observable.of('Network Error');
                }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });

    @Effect() armCameraStatus$ = this.actions$
        .ofType(UserActions.GET_ARM_STATE)
        .mergeMap((payload) => {
            return this.service.getArmState(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error' && (response.status).trim() === "200") {
                this.store.dispatch(this.userActions.getArmStateSuccess(response));
            } else if (response === 'Network Error') {
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

        @Effect() getserverTime$ = this.actions$
        .ofType(UserActions.GET_SERVER_TIME)
        .mergeMap((payload) => {
            return this.service.getserverTime(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                this.store.dispatch(this.userActions.getSiteTimeSuccess(response));
            } else if (response === 'Network Error') {
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


        @Effect() saveLogs$ = this.actions$
        .ofType(UserActions.SAVE_LOG)
        .mergeMap((data) => {
            return this.service.saveLogs(data.payload);
        })
        .do(response => {
            
            if (response !== 'Network Error') {
              console.log("Logs Saved to Server")
            } else if (response === 'Network Error') {
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

        

        
    @Effect() surviewArmCameraStatus$ = this.actions$
        .ofType(UserActions.GET_SURVIEW_ARM_STATE)
        .mergeMap((payload) => {
            return this.service.getSurviewArmState(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                this.store.dispatch(this.userActions.surviewArmStateSuccess(response));
            } else if (response === 'Network Error') {


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

    @Effect() armDisarmInfo$ = this.actions$
        .ofType(ArmStatusActions.GET_ARM_DISARM_INFO)
        .mergeMap((payload) => {
            return this.service.getArmDisArmInfo(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {

                this.store.dispatch(this.armStatusActions.saveArmDisArmInfo(response));
            } else if (response === 'Network Error') {

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

        @Effect() armDisarmStatusInfo$ = this.actions$
        .ofType(ArmStatusActions.GET_ARM_DISARM_STATUS_INFO)
        .mergeMap((payload) => {
            return this.service.getArmDisArmStatusInfo(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.armStatusActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                console.log('chari-site', this.globals.isPvmUser);
                console.log('chari-site', response);

                this.store.dispatch(this.armStatusActions.saveArmDisArmInfo(response));
            } else if (response === 'Network Error') {

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

        @Effect() siteStatusInfo$ = this.actions$
        .ofType(ArmStatusActions.GET_SITE_STATUS)
        .mergeMap((payload) => {
            return this.service.siteStatus(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                this.store.dispatch(this.armStatusActions.getSiteStatusSucess(response));
            } else if (response === 'Network Error') {

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
        
        @Effect() cameraStatusInfo$ = this.actions$
        .ofType(UserActions.GET_CAMERA_STATUS_INFO)
        .mergeMap((payload) => {
            return this.service.getCameraStatusInfo(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                this.store.dispatch(this.userActions.saveCameraStatusInfo(response));
            } else if (response === 'Network Error') {

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
        
    @Effect() surviewArmCamera$ = this.actions$
        .ofType(UserActions.SERVIEW_ARM_CAMERA)
        .mergeMap((payload) => {
            return this.service.surviewArmCamera(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                this.store.dispatch(this.userActions.surviewArmCameraSuccess(response));
            } else if (response === 'Network Error') {
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
    @Effect() surviewDisArmCamera$ = this.actions$
        .ofType(UserActions.SERVIEW_DISARM_ARM_CAMERA)
        .mergeMap((payload) => {
            return this.service.surviewDisArmCamera(payload);
        })
        .do(response => {
            if (response && response === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (response !== 'Network Error') {
                this.store.dispatch(this.userActions.surviewDisArmStateSuccess(response));
            } else if (response === 'Network Error') {


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
    @Effect() monitoringHours$ = this.actions$
        .ofType(MonitorActions.MONITOR_HOURS)
        .mergeMap(monitoring => this.service.monitorHours(monitoring))
        .do(result => {
            console.log('monitoring-results', result.status);
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if(result && result.status === 500) {
                this.store.dispatch(this.monitorActions.monitorHoursSuccess([]))
            } else if (result && result.status && (result.status).trim() === '200') {
                this.store.dispatch(this.monitorActions.monitorHoursSuccess(result))
            } else{
                this.showAlert(result.message, 'Error');
                this.hideLoader();
            }
        });

    @Effect() Ticketing$ = this.actions$
        .ofType(UserActions.POST_MANAGE_ALARM)
        .mergeMap(action => this.service.ticketing(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                window.location.pathname = '/';
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }else if (result !== 'Network Error') {
                this.showAlert('Issue has been successfully submitted', '<span class="icon-tickcircle"></span><br/>' + 'Success!')
            } else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => Observable.of(console.log(error)));

        @Effect() getEventLog$ = this.actions$
        .ofType(UserActions.POST_EVENT_LOG)
        .mergeMap(action => this.service.getEventLog(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                window.location.pathname = '/';
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }
            console.log('eventlog-result'+JSON.stringify(result));
            if ((result !== 'Network Error') && (Number(result.status) === 200)) {
                this.store.dispatch(this.userActions.setEventLogData(result));
            } else if(Number(result.status) !== 200) {
                this.showAlert(result.message, 'Error');
                return Observable.of('Network Error');
            } else {
                 this.showAlert('We are unable to load your information at this time.', 'Error');
                 return Observable.of('Network Error');
            }
        })
        .catch((error) => Observable.of(console.log(error)));


        @Effect() getEventLogVideos$ = this.actions$
        .ofType(UserActions.GET_EVENT_VIDEO)
        .mergeMap(action => 
            this.service.getEventLogVideos(action.payload)
            )
        .do(result => {
            if (result && result === 'LOG OUT') {
                window.location.pathname = '/';
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }
            if ((result !== 'Network Error') && ((result.status).trim() === '200')) {
                this.store.dispatch(this.userActions.setEventLogVideoData(result.eventReports));
            }else if((result.status).trim() !== '200') {
                this.showAlert(result.message, 'Error');
                return Observable.of('Network Error');
            } else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => Observable.of(console.log(error)));

        @Effect() listTicket$ = this.actions$
        .ofType(UserActions.POST_LIST_TICKET)
        .mergeMap(action => this.service.listTicket(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                window.location.pathname = '/';
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }
            
            console.log('listTicket-result'+JSON.stringify(result));
           // this.store.dispatch(this.userActions.setTicketListData(result)); 
            
            if ((result !== 'Network Error' && !result.error) && (result.status !== "Failed")) {

                let data = {};
                // data['tickets'] = [];
                // map(result, (result: any) => {
                //     data['tickets'].push(response);
                // })
                console.log('Inside ticket list listTicket');
                this.store.dispatch(this.userActions.setTicketListData(result)); 
            }  else if (result.status === "Failed") {
                //result = 'There are no tickets assigned to this site';
                result = result.msg;
                this.store.dispatch(this.userActions.setTicketListData([]));
                this.store.dispatch(this.userActions.setTicketErrorData(result));
            }
             else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => Observable.of(console.log(error)));

        @Effect() createTicket$ = this.actions$
        .ofType(UserActions.POST_CREATE_TICKET)
        .mergeMap(action => this.service.createTicket(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                window.location.pathname = '/';
                this.store.dispatch(this.userActions.logout());
                return Observable.of('Network Error');
            }else if (result.status == 'Success' && result !== 'Network Error') {
                if(result.msg && result.msg.indexOf('and') > -1)
                result.msg = result.msg.substring(0,result.msg.indexOf('and')-1);
                this.showTicketAlert(result.msg, '<span class="icon-tickcircle"></span><br/>' + 'Success!')
            } else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => Observable.of(console.log(error)));


    @Effect() monitoringStatus$ = this.actions$
        .ofType(MonitorActions.MONITORING_STATUS)
        .mergeMap(monitoringunit => this.service.monitorStatus(monitoringunit))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result !== 'Network Error') {
                // this.store.dispatch(this.monitorActions.monitorStatusSuccess(result)) by chari
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

    @Effect() monitoringUnit$ = this.actions$
        .ofType(MonitorActions.MONITORING_UNIT)
        .mergeMap(monitoringunit => this.service.monitorUnit(monitoringunit))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result !== 'Network Error') {
                this.store.dispatch(this.monitorActions.monitorUnitSuccess(result))
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

    @Effect() setPin$ = this.actions$
        .ofType(UserActions.SET_PIN)
        .mergeMap(({ payload }) => {
            return this.service.setPin(payload.pin, payload.email, payload.userName)
        })
        .do(result => {
            if (result !== 'Network Error') {

                if (result && result === 'LOG OUT') {
                    this.store.dispatch(this.userActions.logout());
                    window.location.pathname = '/';

                    return Observable.of('Network Error');
                }

                let messageVal;
               if (result !== 'Network Error' && result.status === 200) {
                  messageVal = 'Thanks! Your PIN is now active.';
               }else{
                  messageVal = 'Saving failed.';
               }
                let alert = this.CustomAlert.create({
                    message: messageVal,
                    title: 'Success',
                    enableBackdropDismiss: false,
                    cssClass: 'custum_alert',
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            if (result !== 'Network Error' && result.status === 200) {
                                this.store.dispatch(this.userActions.setPinSuccess(result));
                                this.store.dispatch(this.navs.navigateToPage(Pages.HOME));
                           }
                        }
                    }]
                });
                alert.present();
                // this.showAlert('PIN has been set successfully.', 'Success');
                // this.store.dispatch(this.userActions.setPinSuccess(result));
            
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


    @Effect() verifyPin$ = this.actions$
        .ofType(UserActions.VERIFY_PIN)
        .mergeMap(({ payload }) => {
            return this.service.verifyPin(payload.pin, payload.userName)
        })
        .do(result => {
            console.log("entered verify pin............", result);

            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result !== 'Network Error' && result.status === 200 && result.valid) {
                this.store.dispatch(this.userActions.verifyPinSucces(result));
            } else if (result !== 'Network Error' && result.status === 200 && !result.valid) {
                this.store.dispatch(this.userActions.verifyPinReset())
                this.showAlert('Please enter valid PIN.', 'Failed');
            }
            else if (result === 'Network Error') {
                this.store.dispatch(this.userActions.verifyPinReset())

            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                this.store.dispatch(this.userActions.verifyPinReset())

                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.store.dispatch(this.userActions.verifyPinReset())
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });

    @Effect() resetPin$ = this.actions$
        .ofType(UserActions.RESET_PIN)
        .mergeMap(({ payload }) => {
            return this.service.resetPin(payload);
        })
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result !== 'Network Error' && result.status === 200) {
                this.showAlert(result.message, 'Success')
            } else if (result === 'Network Error') {

                this.showAlert('Failed to send reset link.', 'Error')
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
    disarmData: any = {}
    @Effect() planDisarm$ = this.actions$
        .ofType(UserActions.PLAN_DISARM)
        .map((action) => { this.disarmData = _.clone(action.payload); return action })
        .mergeMap((payload) => this.service.planDisarm(payload))
        .do(result => {
                if (result && result === 'LOG OUT') {
                    this.store.dispatch(this.userActions.logout());
                    window.location.pathname = '/';
                    return Observable.of('Network Error');
                }
                if (result !== 'Network Error' && (result.status).trim() === '200' ) {
                    let alert = this.CustomAlert.create({
                        message: 'Planned site activity (PSA) has been created',
                        title: 'Success',
                        enableBackdropDismiss: false,
                        cssClass: 'custum_alert',
                        buttons: [{
                            text: 'Ok',
                            handler: () => {
                                let data = {
                                    accountid: this.disarmData.accountid,
                                    FromDate: this.disarmData.startDateTime.split('T')[0],
                                    ToDate : this.disarmData.endDateTime.split('T')[0]
                                }
                                this.store.dispatch(this.userActions.getAlarmList(data));
                                console.log(this.disarmData);
                            }
                        }]
                    });
                    setTimeout(() => {
                        alert.present();
                    }, 1500)
                } else if (result !== 'Network Error' && (result.status).trim() !== '200') {
                    let alert = this.CustomAlert.create({
                        message: result.message,
                        title: 'Error',
                        enableBackdropDismiss: false,
                        cssClass: 'custum_alert',
                        buttons: [{
                            text: 'Ok',
                            handler: () => {
                                let data = {
                                    accountid: this.disarmData.accountid,
                                    FromDate: this.disarmData.startDateTime.split('T')[0],
                                    ToDate : this.disarmData.endDateTime.split('T')[0]
                                }
                                this.store.dispatch(this.userActions.getAlarmList(data));
                            }
                        }]
                    });
                    alert.present();
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

    @Effect() callManager$ = this.actions$
        .ofType(UserActions.CALL_MANAGER)
        .mergeMap(action => this.service.callManager(action.payload))
        .do(result => {
            if (result) {
                if (result && result === 'LOG OUT') {
                    this.store.dispatch(this.userActions.logout());
                    window.location.pathname = '/';
                    return Observable.of('Network Error');
                }
                this.store.dispatch(this.userActions.callManagerSucess(result));
            } else if (result === 'Network Error') {
                this.showAlert('We are unable to load your information at this time.', 'Error');
            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        })
    toggleNotifications: boolean = false
    @Effect() toggleNotifications$ = this.actions$
        .ofType(UserActions.TOGGLE_NOTIFICATIONS)
        .map((action) => { this.toggleNotifications = !(action.payload); return action })
        .mergeMap(action => this.service.toggleNotification(!action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result.status === 200) {
                // this.showAlert(result.message, 'Info');
                this.store.dispatch(this.userActions.toggleNotificationSuccess(this.toggleNotifications))
            } else if (result === 'Network Error') {
                this.showAlert('We are unable to load your information at this time.', 'Error');
            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        })

    @Effect() fetchNotifications$ = this.actions$
        .ofType(UserActions.FETCH_NOTIFICATIONS)
        .mergeMap(action => this.service.fetchNotification(action.payload))
        .do(result => {
            if (result.status === 200) {
                if (result && result === 'LOG OUT') {
                    this.store.dispatch(this.userActions.logout());
                    window.location.pathname = '/';

                    return Observable.of('Network Error');
                }
                this.store.dispatch(this.userActions.fetchNotificationSuccess(result));
            } else if (result === 'Network Error') {
                this.showAlert('We are unable to load your information at this time.', 'Error');
            }
            else {
                this.showAlert('We are unable to load your information at this time.', 'Error');
                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        })

    @Effect() sendDeviceToken$ = this.actions$
        .ofType(UserActions.SEND_DEVICE_TOKEN)
        .mergeMap(action => this.service.sendDeviceToken(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result.status === 200) {

            } else if (result === 'Network Error') {
                return Observable.of('Network Error');
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        })

    @Effect() balanceDue$ = this.actions$
        .ofType(UserActions.BALANCE_DUE)
        .mergeMap(action => this.service.balanceDue(action.payload.sfAccountId))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (result.Id) {
                this.store.dispatch(this.userActions.balanceDueSuccess(result));
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

        @Effect() getAlarmToken$ = this.actions$
        .ofType(UserActions.GET_ALARM_TOKEN)
        .mergeMap(payload => { this.payload = payload; return this.service.getSalesForceToken(); } )
        .do(result => {
                if (result && result.access_token !=="") {
                    this.globals.sfToken = result.access_token;
                    this.store.dispatch(this.userActions.getAlarmList(this.payload.payload)); 
                } else if (!result.ok) {
                    this.showAlert('We are unable to load your information at this time.', 'Error');
                } else {
                    this.showAlert('Network Error', 'Error');
                }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time chari.', 'Error');
            return Observable.of('Network Error');
        });

    @Effect() getAlarmList$ = this.actions$
        .ofType(UserActions.GET_ALARM_LIST)
        .mergeMap(action => this.service.getAlarmList(action.payload))
        .do(result => {
                if (result && (result.status).trim() === '200') {
                    this.store.dispatch(this.userActions.getAlarmListSuccess(result));
                } else if ((result.status).trim()  !== '200' && (result.status).trim()  !== '201') {
                    if (window.localStorage.isHomePage === 'false') {
                        this.showAlert(result.message, '');
                    }
                    this.store.dispatch(this.userActions.getAlarmListSuccess([]));
                } else if (result.status === '201' ) {
                    this.store.dispatch(this.userActions.getAlarmListSuccess([]));
                } else {
                    this.showAlert('Network Error', 'Error');
                }
        })
        .catch((error) => {
            console.log('logging-error', error);
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });

    siteDetails: any = {}
    @Effect() deleteAlarm$ = this.actions$
        .ofType(UserActions.DELETE_ALARM)
        .map((action) => { this.siteDetails = _.clone(action.payload); return action })
        .mergeMap(action => this.service.deleteAlarm(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';
                return Observable.of('Network Error');
            }
            if (result && result.status === '200') {
                let alert = this.CustomAlert.create({
                    message: 'Your planned site activity has been deleted.',
                    title: 'Success',
                    enableBackdropDismiss: false,
                    cssClass: 'custum_alert',
                    buttons: [{
                        text: 'Ok',
                        handler: () => {
                            this.store.dispatch(this.userActions.getAlarmList({accountid: this.siteDetails.accountid, FromDate: this.siteDetails.FromDate, ToDate: this.siteDetails.ToDate}));
                        }
                    }]
                });
                alert.present();
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });

    @Effect() getActivePotential$ = this.actions$
        .ofType(PotentialActions.GET_ACTIVE_POTENTIAL)
        .mergeMap(action => this.service.getActivePotential())
        .do(result => {

            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result.status === 200) {

                let potentialList = [];
                let storeData = this.store.select(state => { return { potential: state.user } }).subscribe((data) => {
                    potentialList = data.potential.userData.provigilUserData.potentialList
                });
                let activePotential = potentialList.find((list) => {
                    return (list.potentialId === JSON.parse(result.data));
                })
                if (activePotential) {
                    this.store.dispatch(this.potentialActions.activePotentail(activePotential));
                }
                storeData.unsubscribe();
            }
        })
        .catch((error) => {
            this.showAlert('We are unable to load your information at this time.', 'Error');
            return Observable.of('Network Error');
        });

    @Effect() notfificationCount$ = this.actions$
        .ofType(UserActions.NOTIFICATION_COUNT)
        .mergeMap(action => this.service.notfificationCount())
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result && result.status === 200) {
                this.store.dispatch(this.userActions.notfificationCountSuccess(result));
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

        @Effect() liveRtmpStream$ = this.actions$
        .ofType(UserActions.LIVE_RTMP_STREM)
        .mergeMap(action => this.service.liveRtmpStream(action.payload))
        .do(result => {
            if (result && result === 'LOG OUT') {
                this.store.dispatch(this.userActions.logout());
                window.location.pathname = '/';

                return Observable.of('Network Error');
            }
            if (result && result.status === 200) {
             //this.store.dispatch(this.userActions.liveRtmpStreamSuccess(result['live_streaming'].liveurl));
             this.store.dispatch(this.userActions.liveRtmpStreamSuccess(result.liveurl));
             //window.localStorage.setItem('liveStreamURL',result['live_streaming'].liveurl);
             window.localStorage.liveStreamURL=result.liveurl;//JSON.stringify(result['live_streaming'].liveurl).replace(/^"(.*)"$/, '$1');
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

    @Effect() updatePotential$ = this.actions$
        .ofType(PotentialActions.UPDATE_POTENTIAL)
        .mergeMap(action => this.service.updatePotential(action.payload))
    // .do(result => {
    //     if (result.status === 200) {
    //         return;
    //     } else {
    //         this.showAlert('Failed to Update Potential', 'Error');
    //     }
    // })
    // .catch((error) => {
    //     this.showAlert('We are unable to load your information at this time.asdfasdfsadf', 'Error');
    //     return Observable.of('Network Error');
    // });


    // @Effect() videoplay$ = this.actions$
    //     .ofType(UserActions.VIDEO_PLAY)
    //     .mergeMap(videoplay => this.service.videoplay(videoplay))
    //     .do(result => {
    //         if (result.status === 200) {
    //             this.store.dispatch(this.userActions.videoplay(result));
    //         } else if (result === 'Network Error') {
    //             this.loaderService.hideLoader();
    //           this.showAlert('We are unable to load your information at this time.', 'Error');
    //         }
    //         else {
    //           this.showAlert('We are unable to load your information at this time.', 'Error');
    //             this.loaderService.hideLoader();
    //             return Observable.of('Network Error');
    //         }
    //     })
    //     .catch((error) => {
    //       this.showAlert('We are unable to load your information at this time.', 'Error');
    //         return Observable.of('Network Error');
    //     })
}