import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { File } from '@ionic-native/file';
//import { PhotoLibrary } from '@ionic-native/photo-library';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Network } from '@ionic-native/network';
// import * as PinchZoom from 'pinch-zoom';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Store } from '@ngrx/store';
import { AlertController, Events, Gesture, ModalController, NavController, Platform, ViewController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { MonitorActions, UserActions } from '../../actions';
import { CameraActions } from '../../actions/camera.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { AppConfig, isDesktop } from '../../config/appConfig';
import { CameraList, User } from '../../models/user';
import { IAppState } from '../../reducers';
import { LoadingService } from '../../services/loader.service';
import { Globals } from './../../config/globals';
import { ERROR_LOGGER } from '@angular/core/src/errors';





@Component({
    selector: 'camerahdView',
    templateUrl: 'camerahdView.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraHdViewPage {
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
    private cameraData: any = {};
    currentUrl: any;
    ptzControls: boolean = false;
    private isSd : boolean;
    private cameraName: string;
    orientation: string;
    private hideHeader: boolean = false;
    private previousPage: number;
    private hdButtonClassName = 'cameraview-hdBt';
    pvmUser: string;
    alertPresented: boolean = false;
    analytics: number;
    interval: any;
    serverUrlPtz :any;
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
      //  private photoLibrary: PhotoLibrary,
        private transfer: FileTransfer,
        private file: File,
        private monitorActions: MonitorActions,
        private navCtrl: NavController,
        private viewCtrl: ViewController,
        private platform: Platform,
        private screenOrientation: ScreenOrientation,
        private global: Globals
    ) {
        this.isDesktopEnabled = isDesktop;
        window.localStorage.camspeed=2
        platform.ready().then(() => {
          if (!isDesktop) {
            if (AppConfig.isScreenLock) {
                this.screenOrientation.unlock();
            }
        }
            this.orientation = this.screenOrientation.type;
            this.cd.detectChanges();
            // allow user rotate
            //this.screenOrientation.unlock();
            this.pvmUser = window.localStorage.isPvmUser;
            this.isSd = (this.pvmUser === 'true') ? false : true;
            this.cd.detectChanges();
            this.screenOrientation.onChange().subscribe(
                () => {
                    this.orientation = this.screenOrientation.type;
                    this.hideHeader = false;
                    if(this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.LANDSCAPE || this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY
                        || this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY){
                        this.hideHeader = true;
                        this.store.dispatch(this.cameraActions.hideHeader(true));
                    } else {
                        this.store.dispatch(this.cameraActions.hideHeader(false));
                    }
                    this.cd.detectChanges();
                }
            );
        }).catch(err => {
            console.log('Error while loading platform', err);
        });


    }
    showAlert = (message: string, title: string) => {
        if (!this.alertPresented) {
            this.alertPresented = true;
            let alert = this.CustomAlert.create({
                message: message,
                title: title,
                enableBackdropDismiss: false,
                cssClass: 'custum_alert',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        // alert.dismiss();
                        this.alertPresented = false;
                    }
                }]
            });
            alert.present();
        }
    }
    ionViewDidEnter() {
        // this.store.dispatch(this.potentialActions.getActivePotential());
        this.network.onDisconnect().subscribe(() => {
            this.isOnline = false;
            this.cd.detectChanges();
        });
        this.network.onConnect().subscribe(() => {
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                // if (this.network.type === 'wifi') {
                this.isOnline = true;
                this.cd.detectChanges();
                // }
            }, 3000);
        });
    

        this.userSubscription = this.store.select((state) => {
            return {
                activeSite: state.potential.activePotential,
                navigation: state.navigation
            }
        })
            .subscribe(state => {
                // TODO
                this.cameraData = state.navigation ? state.navigation['NavParams'] : null;
                this.analytics =  (this.pvmUser === 'true') ? 1 : ((this.cameraData && this.cameraData.analyticId) ? this.cameraData.analyticId : 0);
                this.serverUrlPtz = state.activeSite.url;
           //     window.localStorage.siteUrl=state.activeSite.url;
               // this.ptzControls = this.cameraData.ptz
                if(!this.currentUrl) {
                    if (this.analytics === 3) {
                        let i = 1;
                        this.currentUrl = state.activeSite.url + 'SnapShot?channel=' + this.cameraData.cameraId + '&station=recordingStation' + i;
                        this.interval = setInterval(() => {
                            this.currentUrl = state.activeSite.url + 'SnapShot?channel=' + this.cameraData.cameraId + '&station=recordingStation' + i;
                            // if(this.cameraData.cameraId==undefined)
                            // {

                               // alert(this.currentUrl);
                        // }
                            this.cd.detectChanges();       
                              
                           //  console.log(this.cameraData.cameraId);              
                            i++;
                        }, 500);
                    }else if(this.analytics === 1){
                        this.isSd=false;
                        this.switchToHd();

                    } else if(this.analytics !== 0) {
                        this.currentUrl = (this.pvmUser === 'true') ? ((this.cameraData && this.cameraData.hdUrl) ? this.cameraData.hdUrl : '') : ((this.cameraData && this.cameraData.sdUrl) ? this.cameraData.sdUrl : '');
                    }
                }
                if(this.cameraData.ptz==1)
                {
                    this.ptzControls=true;
                }
                else
                {
                    this.ptzControls=false;
                }
                this.cameraName =  (this.pvmUser === 'true') ?((this.cameraData && this.cameraData.Name) ? this.cameraData.Name : '') : ((this.cameraData && this.cameraData.name) ? this.cameraData.name : '');
                this.connected =  (this.cameraData && this.cameraData.connected) ? this.cameraData.connected : false;
                this.previousPage = state.navigation.prevPage;
                this.cd.detectChanges();
            });
            // var el = document.querySelector('.wrapper');
            // var pzoom = PinchZoom(el, {
            //     draggable: true,
            //     maxScale: 4
            // });

             // set to landscape
//this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    setTimeout(() => {
        if (this.currentUrl === '') {
            this.showAlert('Stream not available ', 'Alert');
        }
    }, 1000);
}
    ionViewDidLoad(){
        if(this.platform.is('ios'))
        {
          this.hdButtonClassName = 'cameraview-hdBt-ios hdpadding';
        }else{
          this.hdButtonClassName = 'cameraview-hdBt hdpadding';
        }
  }

  ptzClick(event) {
   
    let clsName:any=event.currentTarget.className;
    clsName=clsName.replace('activated','');
     if(clsName.trim()=='GOTOPRESET')
     {
        window.localStorage.camaction="";
        window.localStorage.camspeed=2;     
        var container = document.querySelector(".camControls");
        var els = container.querySelectorAll('.active'); 
        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('active')   
          }  
          document.getElementsByClassName('SPEED_MEDIUM')[0].classList.add('active');
     }

      window.localStorage.camaction=clsName;
      let speed:any= window.localStorage.camspeed;
      let operation:any=window.localStorage.camaction;
         let ptzActionUrl:any= this.serverUrlPtz.replace(/\/$/, "")+"/CameraService?event=ptz&cameraid="+this.cameraData.cameraId+"&speed="+speed+"&action="+operation;
          this.store.dispatch(this.cameraActions.ptzActions({
           ptzUrl : ptzActionUrl
        }));
  }

  ptzSpeedClick(event) {

    let clsName:any=event.currentTarget.className;
    clsName=clsName.replace('activated','');
    var container = document.querySelector(".camControls");
    var els = container.querySelectorAll('.active');
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('active')
      }

      const classList = event.target.classList;
      const classes = event.target.className;
      classes.includes('active') ? classList.remove('active') : classList.add('active');
      if(clsName='SPEED_LOW')
      {
        window.localStorage.camspeed = 1;
      }
      else
      if(clsName='SPEED_MEDIUM')
      {
        window.localStorage.camspeed = 2;
      }
      else
      {
        window.localStorage.camspeed = 3;
      }

      //window.localStorage.camspeed=clsName;
      let speed:any= window.localStorage.camspeed;
      let operation:any=window.localStorage.camaction;
      let ptzActionUrl:any= this.serverUrlPtz.replace(/\/$/, "")+"/CameraService?event=ptz&cameraid="+this.cameraData.cameraId+"&speed="+speed;//+"&action="+operation;
      this.store.dispatch(this.cameraActions.ptzActions({
       ptzUrl : ptzActionUrl
    }));
  }

  toggleVideo() {
    console.log('executed', this.isSd);
      if(this.isSd ) {
          this.switchToHd();
      } else {
          this.switchToSd();
      }
  }
    switchToHd(){
      this.loaderService.showLoader();
        this.isSd = false;
        this.currentUrl = (this.pvmUser === 'true') ? ((this.cameraData && this.cameraData.hdUrl) ? this.cameraData.hdUrl : '') : ((this.cameraData && this.cameraData.hdurl) ? this.cameraData.hdurl : '');
        setTimeout(() => {
            if (this.currentUrl === '') {
                this.showAlert('Stream not available ', 'Alert');
            }
        }, 1000);
        this.cd.detectChanges();
        setTimeout(() => {
            this.loaderService.hideLoader();
        }, 1000); 
    }
    switchToSd(){
       this.loaderService.showLoader();
        this.isSd = true;
        this.currentUrl = (this.cameraData && this.cameraData.sdUrl) ? this.cameraData.sdUrl : '';
        setTimeout(() => {
            if (this.currentUrl === '') {
                this.showAlert('Stream not available ', 'Alert');
            }
        }, 1000);
        this.cd.detectChanges();
     setTimeout(() => {
            this.loaderService.hideLoader();
        }, 1000);
    }
    closeScreen(){
      if(this.previousPage == Pages.CAMERA){
        this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
      }else if(this.previousPage == Pages.CAMERA_LIST_MENU){
        this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA_LIST_MENU));
      }
    }

    
    ionViewWillLeave() {
      //  this.data.unsubscribe();
        this.userSubscription.unsubscribe();
        clearInterval(this.interval);
    }

    public ngOnDestroy() {

        // stop listening
        //this.gesture.destroy();
    }
}