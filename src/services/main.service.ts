import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';
import { AlertController, Config, Events, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { IAppState } from '../reducers';
import { isDesktop } from './../config/appConfig';
import { LoadingService } from './loader.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class MainService {
    public httpObj: Http;
    public configObj: Config;
    public loaderObj: LoadingService;
    public lastAlertTime: number;
    public customAlertObj: AlertController;
    public hasShownAlert: boolean = false;
    private timeoutMsg: boolean = false;
    public isOnline: boolean = true;
    public networkObj: any;
    private userAuthKey: string = ''
    private userData: any;
    private deviceType: any;
    private loadingIndicator: any;
    public API_NAMES_HASH = {
        IMAGE_URL: '{{c1ceec9e-415e-11e8-842f-0ed5f89f718b}}',
        ARM_DIS_ARM_INFO: '{{1232f3b8-449f-11e8-842f-0ed5f89f718b}}', //{{c1cec9e4-415e-11e8-842f-0ed5f89f718b}} @ToDo: this must be used for monitoring Status
        ARM_CAMERA: '{{99cec3fe-415e-11e8-842f-0ed5f89f718b}}',
        // eventList.ts  stateData clips
        STATE: '{{c1cec796-415e-11e8-842f-0ed5f89f718b}}',
        // ALARM.TS
        SUREVIEW_ARM_CAMERA: '{{c1cecd40-415e-11e8-842f-0ed5f89f718b}}',
        SUREVIEW_ARM_STATE: '{{c1cec9e4-415e-11e8-842f-0ed5f89f718b}}', // used in user.servie.ts
        SUREVIEW_DIS_ARM_CAMERA: '{{c1cee4d8-415e-11e8-842f-0ed5f89f718b}}',
        //  for monitorning status also use fetch arm status   
        FETCH_ARM_STATUS: '{{c1cec9e4-415e-11e8-842f-0ed5f89f718b}}', // not using 
        // 8443
        CAMERA_LIST: '{{c1cee0dc-415e-11e8-842f-0ed5f89f718b}}',
        //get vedios also STATS  API used
        GET_VIDEOS: '{{c1cee9d8-415e-11e8-842f-0ed5f89f718b}}',
        // monitor.ts
        MONITOR_HOURS: '{{c1ced6d2-415e-11e8-842f-0ed5f89f718b}}',
        // MONITOR_UNIT: '{{c1ced0c4-415e-11e8-842f-0ed5f89f718b}}',
        MONITOR_STATUS: '{{c1cec9e4-415e-11e8-842f-0ed5f89f718b}}', // used in user.servie.ts
        // MONITOR_UNIT: '{{c1ced0c4-415e-11e8-842f-0ed5f89f718b}}',
        MONITOR_UNIT: '{{c1ced0c4utu-415e-11e8-842f-0ed5f89f718b}}',
        // 1 st in hash sheet
        EVENTS: '{{c1cebe9a-415e-11e8-842f-0ed5f89f718b}}',
        //    action stats
        STATS: '{{c1cee9d8-415e-11e8-842f-0ed5f89f718b}}',
        PLAN_DISARM: '{{7a10e6bc-43e0-11e8-842f-0ed5f89f718b}}',
        // sureviewCamerasList, STATE  these two APIS are pending for state i did not identified the which api they are used  c1cec9e4cs-415e-11e8-842f-0ed5f89f718b

        MANAGE_ALARMS: '{{651a57a0-43ce-11e8-842f-0ed5f89f718b}}',
        CALL_MANAGER: '{{651a512e-43ce-11e8-842f-0ed5f89f718b}}',
        VIDEO_PLAY: '{{0332ede6-449f-11e8-842f-0ed5f89f718b}}',
        BALANCE_DUE: '{{651a4d0a-43ce-11e8-842f-0ed5f89f718b}}',
        GET_ALARM_LIST: '{{7a10e6bc-43e0-11e8-842f-0ed5f89f718b}}',
        // STATS_LIST: '{{c1cee0dc-415e-11e8-842f-0ed5f89f718b}}',

        //liveurl Streming 
        LIVE_URL:'{{c1ceec9e-415e-11e8-842f-0ed5f89f718b}}'
    }
    private loaderCount: number = 0;

    constructor(
        http: Http,
        public config: Config,
        loader: LoadingService,
        network: Network,
        CustomAlert: AlertController,
        protected store: Store<IAppState>,
        private device: Device,
        public events: Events,
        loadingCtrl: LoadingController
    ) {

        this.httpObj = http;
        this.configObj = config;
        this.loaderObj = loader;
        this.customAlertObj = CustomAlert;
        this.networkObj = network;

        this.networkObj.onDisconnect().subscribe(() => {
            this.isOnline = false;
        });
        this.networkObj.onConnect().subscribe(() => {
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                // if (this.network.type === 'wifi') {
                this.isOnline = true
                // }
            }, 3000);

        });
        this.handleError = this.handleError.bind(this);
    }

    getBaseUrl(): string {
        return this.configObj.get('api_base');
    }
    getTokenData() {
        if (!this.userData) {
            this.store.select((state) => state.user).subscribe((user) => {
                this.userData = user.userData;
            })
        }
    }
    generateHeaderWithParams(apiName, payload) {
        let urlString: string = apiName + payload;
        return urlString;
    }
    /**
     * this function is necessary because the login api is sending invalid JSON as response
     */
    handleLoginResponse(respBody: string): string {
        console.log('handleLoginResponse - RESPONSE'+JSON.stringify(respBody));
        respBody = respBody.replace('null(', '').replace('})', '}');
        
        return respBody;
    }

    /**
     * Handles Network occurred while making API call to the server.
     */
    handleError(resp: Response): Observable<any> {
        console.log('RESPONSE'+JSON.stringify(resp));
            this.loaderObj.hideLoader();
            try {
                if (!resp.ok) {
                    if (resp.url.indexOf('login') !== -1) {
                        return Observable.of(resp.json() || 'Network Error');
                    }else if (resp.status === 401) {
                        const { status, message } = resp.json();
                        if (status.toString() && status[0] === '4' || message === 'Your session has expired, login again.') {
                            if (!this.timeoutMsg) {
                                this.timeoutMsg = true;
                                let alert = this.customAlertObj.create({
                                    message: message,
                                    title: 'Error',
                                    enableBackdropDismiss: false,
                                    cssClass: 'custum_alert',
                                    buttons: [{
                                        text: 'Ok',
                                        handler: () => {
                                            this.timeoutMsg = false;
                                        }
                                    }]
                                });
                                alert.present();
                            }
                            console.log('logout......................');
                            return Observable.of('LOG OUT');
                        }
                        return Observable.of(resp || 'Network Error');
                    } else if(resp.status !== 200) {
                        return Observable.of(resp || 'Network Error');
                    } else {
                        return Observable.of(resp.statusText || 'Network Error');
                    }
                }
                return Observable.of(resp.json().error || 'Internal Server Error');
            } catch (e) {
                return Observable.of(e);
            }
    }
    handleResponse<T, R>(resp: Response, showLoader: boolean, transform?: (value: T) => R) {
        if (showLoader) {
            this.loaderObj.hideLoader();
            console.log('======================================================== cameras handleResponse hide Loader'+new Date().toISOString());
        }
        if (resp && resp.url && resp.url.includes('login')) {
            this.showLoader(true);
        } else {
            this.hideLoader();
            console.log('======================================================== cameras handleResponse hide Loader'+new Date().toISOString());
        }
        let resObj: any;
        if (resp.url.includes('action=LOGIN')) {
            resObj = JSON.parse(this.handleLoginResponse(resp.text()));
        } else {

            console.log('======================================================== cameras handleResponse'+new Date().toISOString());
            try {
                let tempObj  = resp.json();
               

                if (typeof tempObj === 'string' || tempObj instanceof String){
                    resObj = {};
                    resObj.data = tempObj;
                }else
                 resObj = tempObj;

                if(!resObj.status)
                resObj.status = resp.status;
            } catch (e) {
               if(resp.status == 204) { // For Ticketing Services
                resObj = {};
                resObj.status = resp.status;
                return Observable.of(resObj);
               }else{
                resObj = { status: false };
                console.error('Invalid JSON Data :', resp.text(), '\n', resp.url ? resp.url : 'No Url');
                let alert = this.customAlertObj.create({
                    message: 'Invalid response format',
                    title: 'Error',
                    enableBackdropDismiss: false,
                    cssClass: 'custum_alert',
                    buttons: [{
                        text: 'Ok',
                        handler: () => {

                        }
                    }]
                });
                alert.present();
                return Observable.of(resObj);
            }
            }

        }
        console.log('RESPONSE'+JSON.stringify(resObj));
        if (!resp.ok) {
            return Observable.throw(resp);
        }
        // if (transform) {
        // resObj = transform(resObj);
        // }
        return Observable.of(resObj);
    }


    getPvtOptions(): RequestOptions {
         
        let defaultHeaders = {
            'Content-Type': 'application/json',
            'API' : 'c726736ed6a469e5e713118332558b54'
        };
         
        let headers = new Headers(defaultHeaders);
        let options = new RequestOptions({ headers: headers });
        return options;
    }
    getNetAnalyticsOptions(): RequestOptions {
         
        let defaultHeaders = {
            'Content-Type': 'application/json'
        };
         
        let headers = new Headers(defaultHeaders);
        let options = new RequestOptions({ headers: headers });
        return options;
    }


    getOptions(isAuthRequired?: boolean, gatewayActualEndpoint?: string, isSalesForce?: boolean): RequestOptions {
        if (this.device.platform === null) {
            this.deviceType = 'Browser';
        } else {
            this.deviceType = this.device.platform;
        }
        let defaultHeaders = isSalesForce ? {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'os_type': this.deviceType,
            // '_direct': 'true'
        } : {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'os_type': this.deviceType,
                'API' : 'c726736ed6a469e5e713118332558b54'
            };
        if (isAuthRequired) {
            let authHeader = { Authorization: 'Bearer ' + this.userData.token };
            defaultHeaders = Object.assign(defaultHeaders, authHeader);
        }
        if (gatewayActualEndpoint || isSalesForce) {
            let gatewayHeader = { _gateway_target_uri: gatewayActualEndpoint };
            defaultHeaders = Object.assign(defaultHeaders, gatewayHeader);
        }
        let headers = new Headers(defaultHeaders);
        let options = new RequestOptions({ headers: headers });
        return options;
    }

    get<T, R>(url: string, gatewayTargetUri: string, showLoader: boolean, gatewayActualEndpoint?: string, transform?: (value: T) => R): Observable<any> {
            this.getTokenData();
            if (this.isOnline) {
                this.hasShownAlert = false;
                if (showLoader) {
                    this.loaderObj.showLoader();
                }
                let gateWayHeaderParam  = null;
                if(gatewayActualEndpoint)
                  gateWayHeaderParam = this.getGatewayHeader(gatewayActualEndpoint, encodeURI(url.substring(url.indexOf('?'), url.length)));
                let options = this.getOptions(true, gateWayHeaderParam);
                if (!gatewayActualEndpoint) {
                    console.error('Please send actual uri to add in gateway request header.');
                }
                console.log('GET URL'+gatewayTargetUri);
                console.log('GET options'+JSON.stringify(options));
                return this.httpObj.get(gatewayTargetUri, options)
                    .mergeMap(res => this.handleResponse(res, showLoader, transform))
                    .catch(this.handleError);
            } else {
                if (!this.hasShownAlert) {
                    this.showOfflineAlert();
                    this.hasShownAlert = true;
                }
                return Observable.of('Network Error');
            }
    }
  
    authenticateUrl<T, R>(url: string, userName: string, password: string, showLoader: boolean, transform?: (value: T) => R): Observable<any> {
        console.log('============================');
        this.getTokenData();
        if (this.isOnline) {
             
            if (showLoader) {
                this.loaderObj.showLoader();
            }
             

            let headers = new Headers();
            headers.append("Authorization", "Basic " + btoa(userName + ":" + password)); 
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            let options = new RequestOptions({ headers: headers });

            console.log('Authorize GET URL'+url);
            console.log('Authorize GET options'+JSON.stringify(options));

            return this.httpObj.get(url, options)
                .mergeMap(res => {
                    this.hideLoader();
                    return this.handleResponse(res, showLoader, transform)
                })
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            this.hideLoader();
            return Observable.of('Network Error');
        }
    }

    directGatewayGet<T, R>(url: string, gatewayTargetUri: string, showLoader: boolean, gatewayActualEndpoint?: string, transform?: (value: T) => R): Observable<any> {
        console.log('============================');
        this.getTokenData();
        if (this.isOnline) {
            let defaultHeaders = {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'os_type': 'browser',
                // '_direct': 'true'
            }
            if (showLoader) {
                this.loaderObj.showLoader();
            }
            let gatewayHeader = { _gateway_target_uri: url };
            defaultHeaders = Object.assign(defaultHeaders, gatewayHeader);
            let authHeader = { Authorization: 'Bearer ' + this.userData.token };
            defaultHeaders = Object.assign(defaultHeaders, authHeader);
            let headers = new Headers(defaultHeaders);
            let options = new RequestOptions({ headers: headers });
            console.log('directGatewayGet-GET URL'+gatewayTargetUri);
            console.log('directGatewayGet-GET options'+JSON.stringify(options));
            return this.httpObj.get(gatewayTargetUri, options)
                .mergeMap(res => {
                    this.hideLoader();
                    return this.handleResponse(res, showLoader, transform)
                })
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            this.hideLoader();
            return Observable.of('Network Error');
        }
    }

    directGet<T, R>(url: string, showLoader: boolean): Observable<any> {
        let currentDateTime = new Date().getTime();
        console.log('============================');
        this.getTokenData();
        if (this.isOnline) {
             
            if (showLoader) {
                console.log('======================================================== cameras directGet show Loader'+new Date().toISOString());
                this.loaderObj.showLoader();
            }          
            console.log('directGatewayGet-GET URL'+url);
            console.log('chari-get',url);
            return this.httpObj.get(url, {})
                .mergeMap(res => {
                    this.hideLoader();
                    
                    let differenceTime = new Date().getTime() - currentDateTime;
                    console.log('======================================================== cameras directGet dismiss Loader and response '+ this.msToTime(differenceTime));
                    
                    console.log('******************** GET API url ******************** '+ url);
                    console.log('******************** GET API RESPONSE TIME ******************** '+ this.msToTime(differenceTime));
                    return this.handleResponse(res, showLoader, null)
                })
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            this.hideLoader();
           
            return Observable.of('Network Error');
        }
    }
    directPut<T, R>(url: string, body:any,token : any,showLoader: boolean): Observable<any> {
        let currentDateTime = new Date().getTime();
        console.log('============================');
        this.getTokenData();
        if (this.isOnline) {
             
            if (showLoader) {
                console.log('======================================================== cameras directGet show Loader'+new Date().toISOString());
                this.loaderObj.showLoader();
            }          
          
           // const directHeaders = {
               // 'Content-Type': 'application/json',
                //'Authorization':  token
           // }
            //let headers = new Headers(directHeaders);
            let headers = new Headers();
            headers.append("Authorization", token); 
            headers.append("Content-Type", 'application/json');            
            let options = new RequestOptions({ headers: headers });
            options.withCredentials=true;
            //alert(url + '---Test');
            //var random = Math.floor(Math.random() * 10000);
            //alert(url+'----'+body+'------'+JSON.stringify(options));
        
            return this.httpObj.put(url,body,options)
                .mergeMap(res => {
                    this.hideLoader();
                  //  alert(JSON.stringify(res.//_body.streaming_server_url));
                    let differenceTime = new Date().getTime() - currentDateTime;
                    console.log('======================================================== cameras directGet dismiss Loader and response '+ this.msToTime(differenceTime));
                    
                    console.log('******************** GET API url ******************** '+ url);
                    console.log('******************** GET API RESPONSE TIME ******************** '+ this.msToTime(differenceTime));
                    //this.cookieData.deleteAll();
                    //alert(JSON.stringify(res.headers));
                    res.headers.delete('Set-Cookie');
                    return this.handleResponse(res, showLoader, null)
                })
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            this.hideLoader();
           
            return Observable.of('Network Error');
        }
    }

    directDeleteRTMP<T, R>(url: string, token : any,showLoader: boolean): Observable<any> {
        let currentDateTime = new Date().getTime();
        console.log('============================');
        this.getTokenData();
        if (this.isOnline) {
             
            if (showLoader) {
                console.log('======================================================== cameras directGet show Loader'+new Date().toISOString());
                this.loaderObj.showLoader();
            }          
          
            // const directHeaders = {
            //     'Content-Type': 'application/json',
            //     'Authorization':  token
            // }
            // let headers = new Headers(directHeaders);
            let headers = new Headers();
            headers.append("Authorization", token); 
            headers.append("Content-Type", 'application/json');  
            let options = new RequestOptions({ headers: headers });
            options.withCredentials=true;
            //alert(url + '---Test');
           // var random = Math.floor(Math.random() * 10000);
            return this.httpObj.delete(url,options)
                .mergeMap(res => {
                    this.hideLoader();
               //alert(JSON.stringify(res));
                    let differenceTime = new Date().getTime() - currentDateTime;
                    console.log('======================================================== cameras directGet dismiss Loader and response '+ this.msToTime(differenceTime));
                    
                    console.log('******************** GET API url ******************** '+ url);
                    console.log('******************** GET API RESPONSE TIME ******************** '+ this.msToTime(differenceTime));
                    return this.handleResponse(res, showLoader, null)
                })
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            this.hideLoader();
           
            return Observable.of('Network Error');
        }
    }
    msToTime(duration: number) {
          let milliseconds: number =  (duration % 1000) / 100;
           let seconds = Math.floor((duration / 1000) % 60);
           let minutes = Math.floor((duration / (1000 * 60)) % 60);
           let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
           let hoursStr = (hours < 10) ? "0" + hours : hours;
           let minutesStr = (minutes < 10) ? "0" + minutes : minutes;
           let secondsStr = (seconds < 10) ? "0" + seconds : seconds;
      
        return hours + ":" + minutes + ":" + seconds + "." +  milliseconds.toFixed();
      }
      
    getGatewayDirect<T, R>(url: string, gatewayTargetUri: string, showLoader: boolean, gatewayActualEndpoint?: string, transform?: (value: T) => R): Observable<any> {
        this.getTokenData();
        if (this.isOnline) {
            this.hasShownAlert = false;
            if (showLoader) {
                console.log('===============R')
                this.loaderObj.showLoader();
            }
            const directHeaders = {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'os_type': this.deviceType,
                // '_direct': 'true',
                'Authorization': 'Bearer ' + this.userData.token,
                '_gateway_target_uri': url

            }
            let headers = new Headers(directHeaders);
            let options = new RequestOptions({ headers: headers });
            console.log('getGatewayDirect-GET URL'+gatewayTargetUri);
            console.log('getGatewayDirect-GET options'+JSON.stringify(options));
            return this.httpObj.get(gatewayTargetUri, options)
                .mergeMap(res => this.handleResponse(res, showLoader, transform))
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            return Observable.of('Network Error');
        }
    }

    getDirectMethod<T, R>(url: string, showLoader: boolean, transform?: (value: T) => R): Observable<any> {
            this.getTokenData();
            if (this.isOnline) {
                this.hasShownAlert = false;
                if (showLoader) {
                    this.loaderObj.showLoader();
                }
                console.log('getDirectMethod-GET URL'+url);
               
                if(url.includes('ProvigilService')) {
                    return this.httpObj.get(url)
                        .mergeMap(res => this.handleResponse(res, showLoader, transform))
                        .catch(this.handleError);
                } else {
                    let options = this.getOptions(true);
                    console.log('getDirectMethod-GET options'+JSON.stringify(options));
                    return this.httpObj.get(url, options)
                        .mergeMap(res => this.handleResponse(res, showLoader, transform))
                        .catch(this.handleError);
                }
            } else {
                if (!this.hasShownAlert) {
                    this.showOfflineAlert();
                    this.hasShownAlert = true;
                }
                return Observable.of('Network Error');
            }
    }


  

    getGatewayHeader(apiName, payload): string {
        let headerString = this.generateHeaderWithParams(apiName, payload);
        return headerString;
    }

    post<T, R>(url: string, body: any, gatewayTargetUri: string, showLoader: boolean, gateWayActualEndpoint?: string, transform?: (value: T) => R):
        Observable<any> {
            console.log('=====here');
        this.getTokenData();
        if (this.isOnline) {
            this.showLoader();
            if (showLoader) {
                this.loaderObj.showLoader();
            }
            // @Todo: Match api from config instead of depending on index
            let isLoginApi = !(url.indexOf('login') === -1);
            let isAuthRequired = isLoginApi ? false : true;
            gateWayActualEndpoint = isLoginApi ? '' : gateWayActualEndpoint;
            let gateWayHeaderParam = gateWayActualEndpoint ? this.getGatewayHeader(gateWayActualEndpoint, gatewayTargetUri) : '';
            let options;
            if(url.indexOf('ticketing/webservices') > -1 || url.indexOf('recentEscalationsAPI') > -1)
             options = this.getPvtOptions();
             else if(url.indexOf('getCamioDevicesStatus') > -1){
                options = this.getNetAnalyticsOptions();
             } else
             options = this.getOptions(isAuthRequired, gateWayHeaderParam, (url.includes('salesforce')));

            console.log('Post gatewayTargetUri'+gatewayTargetUri);
            console.log('Post url'+ url);
            console.log('Post body'+ body);
            console.log('Post options'+JSON.stringify(options));

            return this.httpObj.post(gatewayTargetUri || url, body, options)
                .mergeMap(res => this.handleResponse(res, showLoader, transform))
                .catch(this.handleError);
        } else {
            if (!this.lastAlertTime || ((new Date().getTime() - this.lastAlertTime) > 10000)) {
                this.lastAlertTime = new Date().getTime();
                this.showOfflineAlert();
            }
            return Observable.of('Network Error');

        }
    }

    delete<T, R>(url: string, gatewayTargetUri: string, showLoader: boolean, gatewayActualEndpoint?: string, transform?: (value: T) => R): Observable<any> {
        this.getTokenData();
        if (this.isOnline) {
            this.hasShownAlert = false;
            this.showLoader();
            let gateWayHeaderParam = null;
            if(gatewayActualEndpoint)
              gateWayHeaderParam = this.getGatewayHeader(gatewayActualEndpoint, encodeURI(url.substring(url.indexOf('?'), url.length)));
            let options = this.getOptions(true, gateWayHeaderParam);
            if (!gatewayActualEndpoint) {
                console.error('Please send actual uri to add in gateway request header.');
            }
            console.log('delete gatewayTargetUri'+gatewayTargetUri);
            console.log('delete options'+JSON.stringify(options));
            return this.httpObj.delete(gatewayTargetUri, options)
                .mergeMap(res => this.handleResponse(res, showLoader, transform))
                .catch(this.handleError);
        } else {
            if (!this.hasShownAlert) {
                this.showOfflineAlert();
                this.hasShownAlert = true;
            }
            return Observable.of('Device Offline');
        }
    }
    showOfflineAlert() {
        if(isDesktop) {
        let alert = this.customAlertObj.create({
            message: "Sorry, no internet connectivity detected. Please reconnect and try again. ",
            title: "Connection Lost",
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
    }
    private loaderTimeOut(timeout?: number): void {
        // try {
        //     setTimeout(() => {
        //         let loaderObj = document.getElementById('customLoader');
        //         if (loaderObj) {
        //             loaderObj.classList.remove('shown');
        //         }
        //     }, timeout || 10000);
        // } catch (e) {

        // }

    }
    private showLoader(isLogin?: boolean): void {
        // try {
        //     let loaderObj = document.getElementById('customLoader');
        //     loaderObj.classList.add('shown');
        // } catch (e) {

        // } finally {
        //     if (isLogin) {
        //         this.loaderTimeOut(90000);
        //     } else {
        //         this.loaderTimeOut();
        //     }
        // }

    }
    private hideLoader(): void {
        // try {
        //     let loaderObj = document.getElementById('customLoader');
        //     loaderObj.classList.remove('shown');
        // } catch (e) {

        // } finally {

        // }
    }
  
}