import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';
import { AlertController, Config, Events, LoadingController } from 'ionic-angular';
import each from 'lodash/each';
import findLastKey from 'lodash/findLastKey';
import { Observable, Subscription } from 'rxjs/Rx';
import { IAppState } from '../reducers';
import { MainService } from '../services/main.service';
// import { User } from '../models/user';
import { isDesktop } from './../config/appConfig';
import { Globals } from './../config/globals';
import { LoadingService } from './loader.service';


@Injectable()
export class CameraService extends MainService {
    private storeSubscription: Subscription;
    private activePotentialUrl: string;

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
        this.storeSubscription = this.store.select(potential => potential).subscribe((potential) => {
            this.activePotentialUrl = potential.potential.activePotential && potential.potential.activePotential.url || '';
        })
    }

    buildUrl(url, payload) {
        let urlString: string = url + '?';
        each(payload, function (value, key) {
            if (findLastKey(payload) === key) {
                urlString = urlString + key + '=' + value
            } else {
                urlString = urlString + key + '=' + value + '&'
            }
        });
        return urlString;
    }

    fetchCameras(cameraDetails): Observable<any> {
        let url = "";
        let dateTime = new Date();
        if (window.localStorage.isPvmUser === 'true') {
            url = this.buildUrl(this.activePotentialUrl + this.config.get('pvmServiceRequests').CamioCameralist, cameraDetails.payload);           
            url=url+'&v='+dateTime;
        } else {
            url = this.buildUrl(this.activePotentialUrl + this.config.get('ivigilServiceRequests').CamioCameralist, cameraDetails.payload);
            url=url+'&v='+dateTime;
        }
        return this.directGet(url, true);
    }

    fetchNetAnalyticsCameras(cameraDetails): Observable<any> {
        let url = this.config.get('pvmServiceRequests').NetAnalyticsCameralist;
          return this.post(url, {'siteName':cameraDetails.payload.unitId}, '', true);
      }

    authenticateCameras(cameraDetails): Observable<any> {
        var payLoad = cameraDetails['payload'];
        return this.authenticateUrl(payLoad.url, payLoad.userName ,payLoad.password, true);
    }
    
    fetchSurviewCameras(cameraDetails): Observable<any> {
        let url = this.buildUrl(this.activePotentialUrl,
            cameraDetails.payload);
        return this.getDirectMethod(url, true);
    }
    getLiveUrl(payload): Observable<any> {
        let url = this.buildUrl(this.activePotentialUrl,
            payload);
        return this.get(url, this.config.get('pvmServiceRequests').getLiveUrl, true,this.API_NAMES_HASH.LIVE_URL )
    }
    getLiveUrlRtmp(payload): Observable<any> {
        
        let url = "https://video.pro-vigil.info/api/cameras/sessions?user="+encodeURIComponent(payload["user"]);//this.buildUrl("https://video.pro-vigil.info/api/cameras/sessions", payload.);       
      //  alert(url);
        return this.directPut(url, payload["body"],payload["Authorization"],true);
        // let url = this.buildUrl(this.config.get('pvmServiceRequests').RTMPUrl, payload);
        // alert(url);
        // return this.directGet(url,true);
    }

    deleteLiveRtmpStream(payload): Observable<any> {        
        let url = "https://video.pro-vigil.info/api/cameras/sessions?local_camera_id="+payload["local_camera_id"]+"&user="+encodeURIComponent(payload["user"]);//this.buildUrl(this.config.get('pvmServiceRequests').RTMPUrl, payload);
     //   window.localStorage.liveurl=url;
        //alert(url);
        //alert(payload["Authorization"]);
        return this.directDeleteRTMP(url,payload["Authorization"],true);
    }

    ptzActions(payload): Observable<any> {
        
        let url = payload.ptzUrl;//this.buildUrl(this.config.get('pvmServiceRequests').RTMPUrl, payload);
        window.localStorage.liveurl=url;
        return this.directGet(url,true);

    }
}   