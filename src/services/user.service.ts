import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';
import { AlertController, Config, Events, LoadingController } from 'ionic-angular';
import each from 'lodash/each';
import findLastKey from 'lodash/findLastKey';
import { Observable } from 'rxjs/Rx';
import { Globals } from '../config/globals';
import { IAppState } from '../reducers';
// import { User } from '../models/user';
import { MainService } from '../services/main.service';
import { isDesktop } from './../config/appConfig';
import { LoadingService } from './loader.service';



@Injectable()
export class UserService extends MainService {
    result$: Observable<any>;
    result1$: Observable<any>;
    pvmlogin:boolean;
    constructor(
        http: Http,
        config: Config,
        loader: LoadingService,
        network: Network,
        CustomAlert: AlertController,
        store: Store<IAppState>,
        device: Device,
        events: Events,
        loadingCtrl: LoadingController,
        public globals: Globals

    ) {
        super(http, config, loader, network, CustomAlert, store, device, events, loadingCtrl);
    }

    buildUrl(url, payload) {
        let urlString: string = ''
        if (url !== '') {
            urlString = url + '?';
            each(payload, function (value, key) {
                if (findLastKey(payload) === key) {
                    urlString = urlString + key + '=' + value
                } else {
                    urlString = urlString + key + '=' + value + '&'
                }
            });
        } else {
            each(payload, function (value, key) {
                if (key === 'url') {
                    urlString = urlString + value + '?'
                } else if (findLastKey(payload) === key) {
                    urlString = urlString + key + '=' + value
                } else {
                    urlString = urlString + key + '=' + value + '&'
                }
            });
        }
        return urlString;
    }

    loginUser({ payload }): Observable<any> {
        let url = (this.config.get('pvmServiceRequests').loginUser);
        return this.post(url, payload, '', true);
    }
    loginIvigilUser({ payload }): Observable<any> {
        payload.deviceId = payload.deviceId===null?1:payload.deviceId;
        let url = this.buildUrl(this.config.get('ivigilServiceRequests').loginUser, payload);
        return this.directGet(url,true);
    }
    state(state: any): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').stuserate,
            state.payload);
        return this.get(url, this.config.get('pvmServiceRequests').gatewayTargetUriState, true, this.API_NAMES_HASH.STATE);
    }

     removeURLParameter(url, parameter) {
        //prefer to use l.search if you have a location/link object
        var urlparts = url.split('?');   
        if (urlparts.length >= 2) {
    
            var prefix = encodeURIComponent(parameter) + '=';
            var pars = urlparts[1].split(/[&;]/g);
    
            //reverse iteration as may be destructive
            for (var i = pars.length; i-- > 0;) {    
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                    pars.splice(i, 1);
                }
            }
    
            return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
        }
        return url;
    }
    userArmCamera(armCamera): Observable<any> {
        let url = "";
        if (window.localStorage.isPvmUser === 'true') {
            url = this.buildUrl(this.config.get('pvmServiceRequests').armCamera,
            armCamera.payload);
            url = this. removeURLParameter(url, 'from')
        } else {
            url = this.buildUrl(this.config.get('ivigilServiceRequests').armCamera,
            armCamera.payload);
        }
       return this.directGet(url,true);
    }
    disarmCamera(disarmCamera): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').disarmCamera,
            disarmCamera.payload);
        return this.get(url, this.config.get('pvmServiceRequests').gatewayTargetUriSurviewDisArmCamera, true, this.API_NAMES_HASH.SUREVIEW_DIS_ARM_CAMERA);
    }
    getArmState(idData): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').fetchArmStatus, idData.payload);
        return this.get(url, this.config.get('pvmServiceRequests').fetchArmStatus, true, this.API_NAMES_HASH.MONITOR_STATUS);
    }

    getserverTime(payload): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').serverTime, payload.payload);
        return this.directGet(url,true);
    }

    saveLogs(payload): Observable<any> {
        let url = (this.config.get('pvmServiceRequests').deviceLogData);
        return this.post(url, JSON.stringify(payload), '', false);
    }
    getArmDisArmInfo(info): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').ArmDisarmHistoryDirect, info.payload);       
        return this.directGet(url,true);
    }

    getArmDisArmStatusInfo(info): Observable<any> {
        let url ="";
        console.log('service-user-type', window.localStorage.isPvmUser);
       if(window.localStorage.isPvmUser === 'true') {
            url = this.buildUrl(this.config.get('pvmServiceRequests').ArmDisarmStausHistoryDirect, info.payload);
       } else {
            url = this.buildUrl(this.config.get('ivigilServiceRequests').ArmDisarmStausHistoryDirect, info.payload);
       }       
        return this.directGet(url, false);
    }

    getCameraStatusInfo(info): Observable<any> {
       
        let url = this.buildUrl(this.config.get('pvmServiceRequests').CamerasStatusDirect, info.payload);
        return this.directGet(url,false);
       
    }

    getSurviewArmState(idData): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').surviewArmState, idData.payload);
        return this.get(url, this.config.get('pvmServiceRequests').gatewayTargetUriGetSurviewArmState, true, this.API_NAMES_HASH.SUREVIEW_ARM_STATE);
    }

    surviewArmCamera(idData): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').surviewArmCamera,
            idData.payload);
        return this.get(url, this.config.get('pvmServiceRequests').gatewayTargetUriSurviewArmCamera, true, this.API_NAMES_HASH.SUREVIEW_ARM_CAMERA);
    }
    surviewDisArmCamera(idData): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').surviewDisArmCamera,
            idData.payload);
        return this.get(url, this.config.get('pvmServiceRequests').gatewayTargetUriSurviewDisArmCamera, true, this.API_NAMES_HASH.SUREVIEW_DIS_ARM_CAMERA);
    }

    getvideos(videoplay: any): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').videoplay, videoplay.payload)
        return this.get(url, this.config.get('pvmServiceRequests').videoplay, true, this.API_NAMES_HASH.VIDEO_PLAY);
    }
    monitorHours(monitoring: any): Observable<any> {
        let dynamicUrl = monitoring.payload.url;
        delete(monitoring.payload.url);
        let url = "";
        if (window.localStorage.isPvmUser === 'true') {
            url = this.buildUrl(this.config.get('pvmServiceRequests').MonitoringHours, monitoring.payload);
        } else {
            delete(monitoring.payload.url);
            delete(monitoring.payload.action);
            delete(monitoring.payload.deviceId);
            delete(monitoring.payload.installationid);
         url = this.buildUrl(dynamicUrl + this.config.get('ivigilServiceRequests').MonitoringHours, monitoring.payload);
        }
        return this.directGet(url, true);
    }
    siteStatus( data: any ): Observable<any> {
        let url = '';
        let dynamicUrl = data.payload.url;
        delete(data.payload.url);
        if (window.localStorage.isPvmUser === 'true') {
            url = this.buildUrl(this.config.get('pvmServiceRequests').siteStatus, data.payload);
        } else {
            url = this.buildUrl(dynamicUrl + this.config.get('ivigilServiceRequests').siteStatus, data.payload);
        }
       return this.directGet(url, true);
    }
    monitorStatus({ payload }): Observable<any> {
        let  potentialid  = payload.potentialid;
        let event  = payload.event;
        const url = this.buildUrl(this.config.get('pvmServiceRequests').MonitoringStatus, { event, potentialid });
       return this.directGet(url,true);
    }
    
    monitorUnit(monitoringunit: any): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').monitoringunit, monitoringunit.payload)
        return this.get(url, this.config.get('pvmServiceRequests').monitoring, true, this.API_NAMES_HASH.MONITOR_UNIT);
    }
    ticketing({ description, priority, requestedBy, sfaccountId, subject }): Observable<any> {
        return this.post(this.config.get('pvmServiceRequests').ticketing,
            JSON.stringify({ description, priority, requestedBy, subject }),
            '',
            true, this.API_NAMES_HASH.MANAGE_ALARMS + '/' + sfaccountId);
    }

    getEventLog(eventLogData: any): Observable<any> {
        if (window.localStorage.isPvmUser === 'true') {
            let url = this.buildUrl(this.config.get('pvmServiceRequests').eventLog, eventLogData);
            return this.post(this.config.get('pvmServiceRequests').eventLog,
            JSON.stringify(eventLogData), this.config.get('pvmServiceRequests').eventLog,
            true);
        } else {
            let url = this.buildUrl(this.config.get('ivigilServiceRequests').eventLog, eventLogData);
            return this.directGet(url, true);
        }
        
    }

    getEventLogVideos(eventLogData: any): Observable<any> {
            let url = this.buildUrl(this.config.get('pvmServiceRequests').eventLogVideo, eventLogData);
            window.localStorage.videourl=url;
            return this.directGet(url,true);
    }
    createTicket({ account, installation, user_name, description, source }): Observable<any> {
        return this.post(this.config.get('pvmServiceRequests').createTicket,
            JSON.stringify({ account, installation, user_name, description, source }),
            this.config.get('pvmServiceRequests').createTicket,
            true);
    }

    listTicket({ user_name, source }): Observable<any> {
        return this.post(this.config.get('pvmServiceRequests').createTicket,
            JSON.stringify({  user_name, source  }),
            this.config.get('pvmServiceRequests').ticketsList,
            true);
    }

    setPin(pin: number, email: string, userName: string): Observable<any> {
        return this.post(this.config.get('pvmServiceRequests').setPin, { pin, email, userName }, this.config.get('pvmServiceRequests').setPin, true);

    }
    verifyPin(pin: number, userName: string): Observable<any> {
        return this.post(this.config.get('pvmServiceRequests').verifyPin, { pin, userName }, this.config.get('pvmServiceRequests').verifyPin, true);
    }
    resetPin( payload ): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').resetPin, payload);
       // return this.get(url, this.config.get('pvmServiceRequests').resetPin, true, this.config.get('pvmServiceRequests').resetPin)       
        return this.directGet(url,true);
    }
    planDisarm({ payload }): Observable<any> {
        let accountid = payload.accountid;
        delete (payload.accountid);
        let url = this.buildUrl(this.config.get('salesForceMiddleWare').createPsa, {accountid:accountid, auth: this.globals.sfToken});
        return this.post(url, payload, '', true, null);
    }
    callManager({ sfaccountId }): Observable<any> {
        let url = this.buildUrl('', '');
        return this.get(url, this.config.get('pvmServiceRequests').ticketing, true, this.API_NAMES_HASH.CALL_MANAGER + '/' + sfaccountId)
    }
    toggleNotification(payload): Observable<any> {
        return this.post((this.config.get('pvmServiceRequests').toggleNotifications + '/' + payload),
            {}, (this.config.get('pvmServiceRequests').toggleNotifications + '/' + payload), true);
    }
    fetchNotification(payload): Observable<any> {
        let url = this.buildUrl(this.config.get('pvmServiceRequests').toggleNotifications, payload);
        //return this.get(url, this.config.get('pvmServiceRequests').toggleNotifications, true, this.config.get('pvmServiceRequests').toggleNotifications)
        return this.directGet(url,true);
    }
    sendDeviceToken(payload): Observable<any> {
        return this.post((this.config.get('pvmServiceRequests').sendDeviceToken + '/' + payload),
        {}, (this.config.get('pvmServiceRequests').sendDeviceToken + '/' + payload), true);
    }
    balanceDue(sfaccountId): Observable<any> {
        let url = this.buildUrl('', '');
        return this.get(url, this.config.get('pvmServiceRequests').planDisarm, true, this.API_NAMES_HASH.BALANCE_DUE + '/' + sfaccountId)
    }
    getSalesForceToken(): Observable<any>{
        let url = this.buildUrl(this.config.get('salesForceMiddleWare').generateToken, this.config.get('salesForceMiddleWare').authDetails);
        return this.post(url,{},'',true)
    }
    getAlarmList(data): Observable<any> {
       let url = this.buildUrl(this.config.get('salesForceMiddleWare').getPsaList, data);
       return this.post(url, { 'auth':  this.globals.sfToken}, '' , true)
    }
    deleteAlarm(payload): Observable<any> {
        let eventId = payload.eventid;
        let url = this.buildUrl(this.config.get('salesForceMiddleWare').deletePsa, {eventid: eventId});
        return this.post(url, { 'auth':  this.globals.sfToken}, '' , true);
    }
    updatePotential(payload): Observable<any> {
        let url = this.buildUrl('', '');
        return this.post(this.config.get('pvmServiceRequests').updatePotential + '/' + payload, {}, '', true)
    }
    getActivePotential(): Observable<any> {
        return this.getDirectMethod(this.config.get('pvmServiceRequests').getActivePotential, true)
    }

    notfificationCount(): Observable<any> {
        let url = this.buildUrl('', '');
        return this.get(url, this.config.get('pvmServiceRequests').notfificationCount, true)
    }


    // videoplay(videoplay: any): Observable<any> {
    //     let url = this.buildUrl(this.config.get('pvmServiceRequests').videoplay, videoplay)
    //     return this.get(url, this.config.get('pvmServiceRequests').videoplay, true, this.API_NAMES_HASH.VIDEO_PLAY);
    // }
}