
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';

import { IAppState } from '../../reducers';
import { ChangeDetectorRef } from '@angular/core';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { VideoActions } from './../../actions/video.action';

import { User } from '../../models/user';

import { UserPhonePage } from '../userPhone/userPhone';
import { Device } from '@ionic-native/device';
import { isDesktop } from '../../config/appConfig';


@Component({
    selector: 'stats-home',
    templateUrl: './stats.html',
    // styleUrls:['./stats.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPage {
    service: boolean = true;
    public users: Observable<User>;
    private fromDate: any = new Date().toISOString();
    private toDate: any;
    private siteStats: any;
    private theftsAverted: string;
    private eventsReviewed: string;
    private eventsList: any[];
    private moreEvents: string;
    private header: string;
    private userSubscription: Subscription;
    private isVideoClicked: boolean;
    private potentialId: string;
    private isDesktopEnabled: boolean;
    constructor(
        private store: Store<IAppState>,
        private navActs: NavigationActions,
        private videoActions: VideoActions,
        private device: Device,
        private cd: ChangeDetectorRef) {
        this.toDate = new Date().toISOString();
        this.fromDate = new Date((new Date().getTime()) - (7 * 24 * 60 * 60 * 1000)).toISOString(); //subtracting 7 days
        Object.freeze(this.toDate);
        Object.freeze(this.fromDate);
        // this.userSubscription = this.store.select((state) => ({ stats: state.events, potential: state.potential })).subscribe(events => {
        //     this.potentialId = events.potential.activePotential.potentialId;
        // })
        this.isVideoClicked = false;
        this.isDesktopEnabled = isDesktop;
    }
    getComponent(isShow) {
        this.service = isShow
    }
    // ionViewDidLoad() {
    //     this.store.dispatch(this.videoActions.getvideos({
    //         action: 'mobileclips',
    //         potentialId: this.potentialId,
    //         date: String(new Date().getUTCFullYear()) + '-' + String((new Date().getMonth()) + 1),
    //         deviceId: this.device.uuid ? this.device.uuid : 'webBrowser'
    //     }
    //     ));
    //     this.cd.markForCheck();
    // }
    goToBack() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.HOME))
    }
    ionViewWillLeave() {
        // this.userSubscription.unsubscribe();
    }
    getStatsComponent() {
        this.isVideoClicked = false;
    }
    getVideoComponent() {
        this.isVideoClicked = true;
    }

    // ngDoCheck() {
    //     this.fromDate = new Date().toISOString();
    // }
}