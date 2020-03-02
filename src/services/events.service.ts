import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';
import { AlertController, Config, Events, LoadingController } from 'ionic-angular';
import each from 'lodash/each';
import findLastKey from 'lodash/findLastKey';
import { IAppState } from '../reducers';
import { MainService } from '../services/main.service';
import { LoadingService } from './loader.service';



@Injectable()
export class EventsService extends MainService {
    public httpObj: Http;
    public configObj: Config;

    constructor(
        http: Http,
        config: Config,
        loader: LoadingService,
        network: Network,
        CustomAlert: AlertController,
        store: Store<IAppState>,
        device: Device,
        events: Events,
        loadingCtrl: LoadingController

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

    // /**
    //  * Handles Network occurred while making API call to the server.
    //  */
    // handleError(resp: Response): Observable<any> {
    //     if (!resp.ok) {
    //         return Observable.of(resp.statusText || 'Network Error');
    //     }
    //     // Got 200 .. server sent error intentionally
    //     return Observable.of(resp.json().error || 'Internal Server Error');
    // }
    // handleResponse<T, R>(resp: Response, transform?: (value: T) => R) {
    //     let resObj: any;
    //     resObj = resp.text();
    //     return Observable.of(resObj);
    // }

    // getOptions(Addheaders?: any): RequestOptions {
    //     let headers = new Headers(Addheaders || {
    //         // 'X-API-KEY' : 'my-api-key',
    //         // 'Content-Type': 'application/json; charset=utf-8'
    //     });
    //     let options = new RequestOptions({ headers: headers });
    //     return options;
    // }
    // get<T, R>(url: string, transform?: (value: T) => R): Observable<any> {
    //     let options = this.getOptions();
    //     return this.httpObj.get(url, options)
    //         .mergeMap(res => this.handleResponse(res, transform))
    //         .catch(this.handleError);
    // }

    // post<T, R>(url: string, body: any, transform?: (value: T) => R, headers?: any):
    //     Observable<any> {
    //     let options = this.getOptions(headers);
    //     return this.httpObj.post(url, body, options)
    //         .mergeMap(res => this.handleResponse(res, transform))
    //         .catch(this.handleError);
    // }
    fetchStats(queryData: any) {
        // return this.get(this.configObj.get('pvmServiceRequests').getVedios + '?'
        //     + 'action=STATS&'
        //     + 'potentialId=' + String(queryData.payload.potentialId) + '&'
        //     + 'device=asd&'
        //     + 'date=' + queryData.payload.date);

        //     let url = this.buildUrl(this.config.get('pvmServiceRequests').armCamera,
        //     queryData.payload);
        // return this.get(url, this.config.get('pvmServiceRequests').gatewayTargetUriArmCamera, true, this.API_NAMES_HASH.STATS);

        let url = this.buildUrl('', '');
        let buildUrl = this.buildUrl('', queryData.payload);
        return this.get(url, this.config.get('pvmServiceRequests').armCamera, true, this.API_NAMES_HASH.STATS + '?' + buildUrl);
    }

    // fetchEvents(dateRangeXml: string): Observable<any> {
    //     let headers = {
    //         'SOAPAction': 'http://tempuri.org/ISVDataService/EventsGetBetween',
    //         'Content-Type': 'text/xml'
    //     }
    //     return this.post(this.configObj.get('pvmServiceRequests').events, dateRangeXml, null, headers);
    // }
}