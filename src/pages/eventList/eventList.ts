import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModalController, Platform, LoadingController ,ToastController  } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

import { IAppState } from '../../reducers';
import { AppConfig } from './../../config/appConfig';

import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { CameraActions } from '../../actions/camera.actions';
import { PotentialActions } from '../../actions/potential.action';
import { EventListAction } from '../../actions/eventList.action';

import { User, CameraList } from '../../models/user';

import { UserPhonePage } from '../userPhone/userPhone';
import { map, find } from 'lodash';
import { Device } from '@ionic-native/device';
import { isDesktop } from './../../config/appConfig';

@Component({
    selector: 'page-event-list',
    templateUrl: 'eventList.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListPage {
    public users: Observable<User>;
    public showdata: boolean;
    private stateDetailsReponse: any;
    private state: any;
    public showBtn: Boolean = false;
    public data: Subscription;
    public hideme = [];
    private potentialId: string;
    private userSubscription: Subscription;
    private statedata: any;
    private savedDate: any;
    private videoDetails: any;
    private statsEvents: any;
    private loading: any;
    private numberOfVideos: number = 0;


   

    constructor(
        private store: Store<IAppState>,
        private navActs: NavigationActions,
        private cameraActions: CameraActions,
        private potentialActions: PotentialActions,
        private eventListActions: EventListAction,
        private modalCtrl: ModalController,
        private cd: ChangeDetectorRef,
        private device: Device,
        private platform: Platform,
        private streamingMedia: StreamingMedia,
        private toastCtrl: ToastController ) {
        this.removePreviousVideos()
        this.userSubscription = store.select((state) => {
            return {
               // event: state.eventList,
               potential: state.potential,
               events: state.events,
               // video: state.video
            }
        })
            .subscribe(state => {
                 // this.statedata = state.event ? state.event.statedata : '';
                 this.statsEvents = (state.events.siteStats && state.events.siteStats.SiteStatistics && state.events.siteStats.SiteStatistics.Events) ? state.events.siteStats.SiteStatistics.Events : []
                 this.potentialId = state.potential.activePotential.potentialId || '';
                 this.savedDate = state.events.selectedDate ? state.events.selectedDate : String(new Date().getUTCFullYear()) + '-' + String((new Date().getMonth()) + 1);
                 // this.videoDetails = state.video.videoList;
                 this.showBtn = false;
                 cd.markForCheck();
 
            }
            );
    }
    ionViewWillLeave() {
        this.showBtn = false;
        this.userSubscription.unsubscribe();
    }
    ionViewDidLoad() {
        this.store.dispatch(this.eventListActions.stateData({ action: 'clips', potentialId: this.potentialId, date: String(new Date(this.savedDate).getUTCFullYear()) + '-' + String((new Date(this.savedDate).getMonth()) + 1), device: this.device.uuid ? this.device.uuid : 'webBrowser' }));
        this.cd.detectChanges();
    }
    private removePreviousVideos(): void {
        let allVideos = document.getElementsByTagName('video');
        if (allVideos) {
            for (var v = 0; v < allVideos.length; v++) {
                allVideos[v].remove();
            }
        }
    }

    private playPauseClickedVideo(videoIndex, url): void {
        if (isDesktop) {
            if (navigator.onLine) {  
                this.showBtn = true;
                let currentVideoElement: HTMLVideoElement = document.getElementById('more-video-' + videoIndex) as HTMLVideoElement;
                // let morePlayBtn = document.getElementById('morePlayBtn-' + videoIndex);
                try {
                    if (currentVideoElement.paused) {
                        currentVideoElement.play();
                        // morePlayBtn.classList.remove('paused');
                        // morePlayBtn.classList.add('playing');
                    } else {
                        currentVideoElement.pause();
                        // morePlayBtn.classList.remove('playing');
                        // morePlayBtn.classList.add('paused');
        
                    }
                } catch (e) {
                    console.error('Error playing video', e);
                }
            }else{
                this.showToast('You are currently offline.The video can not be played.');
            }
        
        } else {
            if (navigator.onLine) {
                if (this.platform.is('ios')) {
                    let options: StreamingVideoOptions = {
                        successCallback: () => {
                            this.loading.dismiss();
                        },
                        errorCallback: (e) => {
                           this.loading.dismiss();
                        }
                    };
                    this.streamingMedia.playVideo(url, options);
                } else {
                    this.showBtn = true;
                    let currentVideoElement: HTMLVideoElement = document.getElementById('more-video-' + videoIndex) as HTMLVideoElement;
                    // let morePlayBtn = document.getElementById('morePlayBtn-' + videoIndex);
                    try {
                        if (currentVideoElement.paused) {
                            currentVideoElement.play();
                            // morePlayBtn.classList.remove('paused');
                            // morePlayBtn.classList.add('playing');
                        } else {
                            currentVideoElement.pause();
                            // morePlayBtn.classList.remove('playing');
                            // morePlayBtn.classList.add('paused');
        
                        }
                    } catch (e) {
                        console.error('Error playing video', e);
                    }
                }
            }
                else{
                  this.showToast('You are currently offline.The video can not be played.');
                }
              }
  
    }
  decrementVideoNumber() {
    if (this.numberOfVideos >= 1) {
      this.numberOfVideos--;
    }
    this.cd.detectChanges();
  }

        private showToast(message: string) {
            let toast = this.toastCtrl.create({
              message: message,
              duration: 3000,
              position: 'top'
            });
            this.decrementVideoNumber();
            toast.present();
          }

}
