import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';
import { AlertController, Config, Events, LoadingController } from 'ionic-angular';
import { each, findLastKey } from 'lodash';
import { Observable } from 'rxjs/Rx';
import { IAppState } from '../reducers';
// import { User } from '../models/user';
import { MainService } from '../services/main.service';
import { Globals } from './../config/globals';
import { LoadingService } from './loader.service';




@Injectable()
export class StatsService extends MainService {

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
    getStatsList(statsInfo: any): Observable<any> {
        let url = '';
        if (window.localStorage.isPvmUser === 'true') {
            url = this.buildUrl(this.config.get('pvmServiceRequests').stats, statsInfo);
        } else {
          url = this.buildUrl(this.config.get('ivigilServiceRequests').stats, statsInfo);
        }
        return this.directGet(url, true);
    }
}