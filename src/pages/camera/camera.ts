import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { File } from '@ionic-native/file';
//import { PhotoLibrary } from '@ionic-native/photo-library';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { Store } from '@ngrx/store';
import { AlertController, Events, Gesture, ModalController, Platform } from 'ionic-angular';
import { find, map } from 'lodash';
import { Observable, Subscription } from 'rxjs/Rx';
import { MonitorActions, UserActions } from '../../actions';
import { CameraActions } from '../../actions/camera.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { isDesktop } from '../../config/appConfig';
import { CameraList, User } from '../../models/user';
import { IAppState } from '../../reducers';
import { AppConfig } from './../../config/appConfig';
import { Globals } from './../../config/globals';
import { LoadingService } from './../../services/loader.service';





@Component({
    selector: 'camera',
    templateUrl: 'camera.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraPage {
    public users: Observable<User>;
    @ViewChild('pinchElement') pinchElement: any;
    public showBtn: Boolean;
    public data: Subscription;
    public clipUrl: string;
    public liveUrl: string;
    private imageUrl: Object;
    private hasImageLoaded: boolean;
    private userSubscription: Subscription;
    private CameraId: string;
    private siteName: string;
    private activeCamera: CameraList;
    private cameraList: Array<CameraList>;
    private searchItems: Array<CameraList>;
    public isCameraList: boolean;
    private items: any
    private list: any
    private formData: any
    private potentialId: string
    private installationId: string
    private listItems: Array<any>
    private cameraListItems: Array<CameraList>
    private searchListItems: Array<any>
    private isListView: boolean
    private defaultList: Array<any>;
    private isOnline: boolean;
    private showControls: boolean = true;
    private scale: number = 1;
    private gesture: Gesture;
    private screenShotImageData: string;
    private activeUrl: string;
    private cameraUrl: string;
    private connected: boolean;
    private isArmStatusCalled: boolean = false;
    private isDesktopEnabled: boolean;
    private activePotential: any = {};
    private isCameraAuthenticated: boolean = false;
    private isProcessing: boolean = false;
    private unitId: string = '';
    private callCount: number = 0;
    private options: StreamingVideoOptions;
    liveType : string = 'HD LIVE';
    pvmUser: string;
    constructor(
        private store: Store<IAppState>,
        private navActs: NavigationActions,
        private cameraActions: CameraActions,
        private potentialActions: PotentialActions,
        private userActions: UserActions,
        private modalCtrl: ModalController,
        private loaderService: LoadingService,
        private CustomAlert: AlertController,
        private cd: ChangeDetectorRef,
        private network: Network,
        private events: Events,
     //   private photoLibrary: PhotoLibrary,
        private transfer: FileTransfer,
        private file: File,
        private monitorActions: MonitorActions,
        public platform: Platform,    
        private screenOrientation: ScreenOrientation,
        private streamingMedia: StreamingMedia,
        private global: Globals
    ) {
        this.isDesktopEnabled = isDesktop;
        platform.ready().then(() => {
            if (!isDesktop) {
                if (AppConfig.isScreenLock) {
                    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
                }
            }
            
        /* this below code for the  HD Or SD  LIVE / */
        this.pvmUser = window.localStorage.isPvmUser;
        this.liveType = (this.pvmUser === 'true') ? 'HD LIVE' : 'SD LIVE';
       
        }).catch(err => {
            console.log('Error while loading platform', err);
    });
    }

    ionViewDidEnter() {
        window.localStorage.livestreamtrue=false;
        // this.store.dispatch(this.potentialActions.getActivePotential());
        this.network.onDisconnect().subscribe(() => {
            this.isOnline = false;
            this.cd.detectChanges();
        });

      /*   this.network.onConnect().subscribe(() => {
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                // if (this.network.type === 'wifi') {
                this.isOnline = true;
                this.cd.detectChanges();
                // }
            }, 3000);
        }); */

        this.userSubscription = this.store.select((state) => {
            return {
                camera: state.camera, potential: state.potential, user: state.user
            }
        })
            .subscribe(state => {
                this.callCount++;
                this.activePotential = state.potential.activePotential ? state.potential.activePotential : {};
                this.siteName = state.potential.activePotential ? state.potential.activePotential.siteName : '';
                this.potentialId = state.potential.activePotential ? state.potential.activePotential.potentialId : '';
                this.installationId = state.potential.activePotential ? state.potential.activePotential.installationId : '';
                this.activeUrl = state.potential.activePotential ? state.potential.activePotential.url : '';
                this.isListView = state.potential.activePotential ? state.potential.activePotential.surview : false;
                this.CameraId = state.camera ? state.camera.ActiveCamera ? state.camera.ActiveCamera.CameraId : '' : '';
                this.liveUrl = state.camera ? state.camera.LiveUrl : '';
                this.activeCamera = state.camera ? state.camera.ActiveCamera : undefined;
                this.unitId = (state.potential.activePotential && state.potential.activePotential.unitId) ? state.potential.activePotential.unitId : '';
              
                if (this.activeCamera && this.activeCamera.connected === 'false') {
                    this.connected = false;
                } else if (this.activeCamera && this.activeCamera.connected === 'true') {
                    this.connected = true;
                }
                this.listItems = state.camera ? (state.camera.List ? (state.camera.List[this.potentialId] ?
                    state.camera.List[this.potentialId].map((list) => { return (list.Name) }) : []) : []) : [];
                this.cameraListItems = state.camera ? state.camera.List ? state.camera.List[this.potentialId] : [] : [];
                this.searchListItems = this.listItems;
                this.cameraList = state.camera ? state.camera.List ? state.camera.List[this.potentialId] : [] : [];
                this.list = state.potential.list ? state.potential.list : [];
                this.isOnline = state.user.isOffline ? state.user.isOffline : false;
                this.items = this.list.map((list) => {
                    return (list.siteName)
                }
                );

                this.searchItems = this.items;
                this.listItems = this.cameraList;
            
                this.defaultList =  this.listItems ? this.listItems.slice() : [];
                Object.freeze(this.defaultList);  //so that this cannot be changed and always be used as reference.

                // this.clipUrl = (AppConfig['pvmServiceRequests'].ImageUrl).replace('CameraId', this.CameraId).replace('cameraUrl', this.activeUrl);

                if (this.cameraList) {

                   
                    if (this.cameraList.length > 0 && !this.isCameraAuthenticated && !this.isProcessing){
                        this.isProcessing = true;
                        //this.store.dispatch(this.cameraActions.authenticateCamera({ userName: 'root', password: '60056005', url : this.cameraList[0].sdUrl }));
                    }

                    this.imageUrl = {};
                    let imagePath = AppConfig['pvmServiceRequests'].ImageUrl;
                    map(this.cameraList, (element, i) => {
                        this.imageUrl[element.CameraId] = imagePath.replace('CameraId', element.CameraId);
                        return this.imageUrl;
                    })
                }

                if(state.camera && state.camera.isRefresh && (state.camera.isRefresh == true)){
                    this.isCameraAuthenticated = true;
                    this.isProcessing = false;
                }

                if (!this.isArmStatusCalled) {
                    this.isArmStatusCalled = true;
                   // this.store.dispatch(this.monitorActions.monitorStatus({ event: 'MonitoringStatus', potentialid: state.potential.activePotential.potentialId }));
                }
                this.cd.detectChanges();
            });
      //  if (this.potentialId && !this.activeCamera) {
          if (navigator.onLine) {
                if(this.pvmUser === 'true') {
                    this.store.dispatch(this.cameraActions.fetchCameras({ event: 'potential', potentialid: this.potentialId, unitId: this.unitId, isFetchImage: 'true'}));
                } else {
                    this.store.dispatch(this.cameraActions.fetchCameras({ event: 'potential', potentialId: this.potentialId,from:'newmobileapp'}));
                }
          }
       // }
        
        //Temporarily commented during merging
        //    this.store.dispatch(this.userActions.notfificationCount());
        
        //Unsued so commented
        // this.store.dispatch(this.userActions.getArmDisArmInfo({
        //     fdate: String(new Date().getMonth() + 1) + '/' + (new Date().getDate() - 2 + '/' + new Date().getFullYear()),
        //     tdate: String(new Date().getMonth() + 1) + '/' + ((new Date().getDate()) + '/' + new Date().getFullYear()),
        //     sitename: this.siteName,
        //     unitId: this.unitId,
        //     event: 'MonitoringStatus', potentialid: this.activePotential.potentialId 
        // }));
        this.hasImageLoaded = true;
       // this.updateUrl();
        this.cd.detectChanges();
        // setTimeout(() => {
        //     this.drawImageOnCanvas();
        // }, 5000);
        setTimeout(() => {
            try {
                // this.initializeZoom();
            }
            catch (e) {

            }
        }, 10);
        // this.store.dispatch(this.userActions.balanceDue({
        //     sfAccountId: this.activePotential.sfaccountId
        // }));
        if(this.activeCamera && Object.keys(this.activeCamera).length){
            this.playCamera();
        }

    }
    // private drawImageOnCanvas(): void {
    //     const canvas = document.getElementById("videoCanvas") as HTMLCanvasElement;
    //     const ctx = canvas.getContext("2d");
    //     const img:HTMLImageElement = new Image();
    //     img.src = this.clipUrl;
    //     img.crossOrigin = "Anonymous";
    //     img.onload = function() {
    //         ctx.drawImage(img,0,0);
    //     };
    // }
    // saveScreenShot(): void {
    //     alert()
    //     const canvas: any = document.getElementById("videoCanvas");
    //     this.screenShotImageData = canvas.toDataURL('image/jpeg');
    //     document.getElementById('downloadLink').click();
    // }plan
    updateUrl() {
        let imagePath = AppConfig['pvmServiceRequests'].ImageUrl;
        let timer = Observable.timer(0, 1000);
        this.data = timer.subscribe((newTime) => {

            if (this.CameraId !== '' && !this.isOnline) {
                if (this.hasImageLoaded) {
                    this.hasImageLoaded = false;
                    let imageUrl = imagePath.replace('CameraId', this.CameraId).replace('cameraUrl', this.activeUrl);
                    this.clipUrl = imageUrl + '?' + newTime;
                }
                this.cd.detectChanges();
            }
        })
    }

    playCamera() {
        let payload = {};
        payload['cameraname'] = this.activeCamera.Name;
        payload['installationid'] = this.installationId;
        this.store.dispatch(this.cameraActions.liveUrl(payload));
        this.connected = (this.activeCamera.connected === 'true' ? true : false);
        this.events.publish('zoom:reset');
        this.cd.detectChanges();
    }

    cameraListUrl(camObj) {
        return (AppConfig['pvmServiceRequests'].ImageUrl).replace('CameraId', camObj.CameraId).replace('cameraUrl', this.activeUrl);
    }
    ionViewWillLeave() {
        //this.data.unsubscribe();
        this.userSubscription.unsubscribe();
        this.store.dispatch(this.cameraActions.activeCamera({}));
    }

    public setFlag(): void {
        this.hasImageLoaded = true;
    }

    navigateToCameraListPage() {
        this.isCameraList = !this.isCameraList;
    }

    // itemSelected(item) {
    //     let potentialId = this.potentialId;
    //     this.isCameraList = false;
    //     this.formData = find(this.list, { siteName: item });
    //     if (potentialId === this.formData.potentialId) {
    //         this.store.dispatch(this.potentialActions.activePotentail(this.formData));
    //     } else {
    //         this.store.dispatch(this.potentialActions.activePotentail(this.formData));
    //         if(this.formData.surview === true){
    //             this.store.dispatch(this.cameraActions.fetchSureviewCameras({ action: 'SITEWISECAMERAS', potentialId: this.formData.potentialId }));
    //         }else{ 
    //             this.store.dispatch(this.cameraActions.fetchCameras({ event: 'potential', potentialId: this.formData.potentialId }));
    //         }

    //     }
    // }

    cameraSelected(item) {
        this.isCameraList = false;
        this.formData = find(this.cameraListItems, { Name: item.Name });
        this.store.dispatch(this.cameraActions.activeCamera(this.formData));
        this.updateActiveCamera(item,false);
    }

    getListItems(ev) {
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.listItems = this.defaultList.filter((item) => {
                return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            return true;
        }
        else {
            this.listItems = this.defaultList
        }
    }
    updateActiveCamera(camera: CameraList,isSD:boolean) {
      //isSD

      if(camera.Name == "B"){ // HD VIEW
                // this.store.dispatch(this.cameraActions.liveUrlSuccess(''));
        // let loaderObj = document.getElementById('customLoader');
        // loaderObj.classList.add('shown');
        this.store.dispatch(this.cameraActions.activeCamera(camera));
        let payload = {};
        payload['cameraname'] = camera.Name;
        payload['installationid'] = this.installationId;
        this.store.dispatch(this.cameraActions.liveUrl(payload));
        this.connected = (camera.connected === 'true' ? true : false);
        this.events.publish('zoom:reset');
        this.cd.detectChanges();
    }

        if(true){ // SD VIEW
            let payload = {
                desktop: false,
                sdUrl: camera.sdUrl,
                hdUrl: camera.hdUrl,
                name: camera.Name,
            }
            this.store.dispatch(this.cameraActions.playLive(payload));
        }
    }
    navigateToCameraHdViewPage(item) {
      //  window.localStorage.cameraData=JSON.stringify(item);
    //   if(item.analyticId==1)
    //   {
    //     this.store.dispatch(this.userActions.liveRtmpStream({
    //         //action: 'LIVE_RTMP_STREM',
    //         uniqueCameraID:item.cameraId,
    //         potentialID:this.potentialId
    //     }));
    //     setTimeout(() => {
    //                 //    (<any>window).VideoPlayerVLC.play(
    //                 //         window.localStorage.liveStreamURL,
    //                 //         done => {},
    //                 //         error => {}
    //                 //    );
    //                 // }, 1000);
                   
    //                 //this.streamingMedia.playVideo(window.localStorage.liveStreamURL, this.options);
    //                 (<any>window).videoStreamer.streamRTSP(window.localStorage.liveStreamURL);
    //             }, 1000);
    //             }
    //             else
    //             {
        this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA_HD_VIEW_PAGE, false, item,Pages.CAMERA));
              // }
    }
    navigateToMaskPage(item) {
        this.store.dispatch(this.navActs.navigateToPage(Pages.MASK_IMAGES, false, item, Pages.CAMERA));
    }
    playStream(item) {
        try {
            this.options = {
                successCallback: () => {
                },
                errorCallback: (e) => {
                    console.log(e);
                },
                orientation: 'portrait',
                shouldAutoClose: true,
                controls: false
            }
            if(!this.platform.is('ios')){
                item.hdUrl = item.hdUrl.replace("/playlist.m3u8", "");
                item.hdUrl = item.hdUrl.replace("http", "rtsp");
              }
          //this.streamingMedia.playVideo('rtsp://54.210.211.11:1935/live/vgs-8.stream', this.options);
          this.streamingMedia.playVideo(item.hdUrl, this.options);
        }
        catch(e) {
          console.log(e);
        }
      }
    // liveUrlPrompt(){
    //         // var txt;
    //         // var argument = prompt("Please enter your name:", this.liveUrl.toString());
    //         // if (argument == null || argument == "") {
    //         //   txt = "User cancelled the prompt.";
    //         // } else {
    //         //     this.playLiveUrl(argument);
    //         // }
    //         // console.log(hdwplayer());
    //         if (this.liveUrl) {
    //             if (this.isDesktopEnabled) {
    //                 let video_token = this.liveUrl.split('/', 5)[4];
    //                 console.log(video_token);
    //                 document.getElementById('player').innerHTML = '';
    //                 hdwplayer({
    //                     id        : 'player',
    //                     swf       : 'player/player.swf',
    //                     width     : '65%',
    //                     height    : '400',
    //                     type     : 'rtmp',
    //                     streamer : 'rtmp://rtmp.camio.com/live',
    //                     video : video_token
    //                 });
    //             } else {
    //                 this.playLiveUrl(this.liveUrl.toString());
    //             }
    //         } else {
    //             let alert = this.CustomAlert.create({
    //                 message: "Live view not available",
    //                 title: 'ERROR',
    //                 enableBackdropDismiss: false,
    //                 cssClass: 'custum_alert',
    //                 buttons: [{
    //                     text: 'Ok'
    //                     // handler: () => {
    //                     //     // alert.dismiss();
    //                     // }
    //                 }]
    //             });
    //             alert.present();
    //         }
    // }

    //     playLiveUrl(argument) {
    //         console.log(this.liveUrl, '==========h');
    //         (window as any).VideoPlayerVLC.play(
    //             argument,
    //             done => {
    //                 console.log('done success ===>')
    //                 // alert('success')
    //             },
    //             error => {
    //                 console.log('error')
    //                 // alert('error')
    //             }
    //         );
    //     }

    surviewCameraSelected() {

        let alert = this.CustomAlert.create({
            message: "The camera you're trying to view isn't currently compatible with this app. Please contact your Pro-Vigil Account Manager with any questions.",
            title: 'Warning',
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
    takeScreenShot() {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const Url = this.clipUrl

        fileTransfer.download(Url, this.file.dataDirectory + 'clip.jpeg').then((entry) => {
            console.log('download complete: ' + entry.toURL());
            // try {
            //     this.photoLibrary.requestAuthorization().then(() => {
            //         if ((window as any).cordova) {
            //             this.photoLibrary.getAlbums().then((albums) => {
            //                 this.photoLibrary.saveImage(entry.toURL(), 'Pro-vigil')
            //                     .then(() => {
            //                         let alert = this.CustomAlert.create({
            //                             message: "Screenshot saved successfully.",
            //                             title: 'Success',
            //                             enableBackdropDismiss: false,
            //                             cssClass: 'custum_alert',
            //                             buttons: [{
            //                                 text: 'Ok',
            //                                 handler: () => {
            //                                     // alert.dismiss();
            //                                 }
            //                             }]
            //                         });
            //                         alert.present();
            //                     });
            //             });
            //         } else {
            //             console.log('Screenshot failed silently because cordova is not available.')
            //         }
            //     })
            //         .catch(err => console.log('permissions weren\'t granted'));
            // } catch (e) {
            //     console.warn('Screenshot Error :->', e);
            // }
        }).catch((e) => {
            console.log(e);
        });

    }


    public initializeZoom() {

        // create a new Gesture instance hooked to the DOM element
        try {
            this.gesture = new Gesture(this.pinchElement.nativeElement);

            // start listening for ...
            this.gesture.listen();

            // ... the pinchstart event
            this.gesture.on('pinchstart', (e) => {
            });

            // ... for the pinch event
            this.gesture.on('pinch', (e) => {
            });

            // ... for the pinchend event
            this.gesture.on('pinchend', (e) => {
            });

        } catch (e) {
            console.log(e);
        }
    }

    public ngOnDestroy() {

        // stop listening
        this.gesture.destroy();
    }
}