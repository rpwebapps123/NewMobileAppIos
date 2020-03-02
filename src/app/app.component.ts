import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  Nav,
  Platform,
  ModalController,
  Modal,
  AlertController,
  IonicApp,
  ToastController
} from 'ionic-angular';
//import { StatusBar, Splashscreen } from 'ionic-native';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers';
import {
  HomePage, UserPhonePage, CreateAccount, MonitorPage, Login, BalanceDuePage,
  ArmDisarmInfo, CameraListMenu, VideoPage, CameraPage,
  PotentialListMenu, PlayVideo, StatsPage, SettingsPage, AboutUsPage, PinPage, TicketingPage, EventListPage, Alarms, SetupPinPage, NotificationsPage,CameraHdViewPage,
  EventlogDetailPage,SitesListPage, MaskingPage
} from '../pages';
import { Navigation, NavigationType } from '../models/navigation';
import { NavigationActions, Pages } from '../actions/navigation.actions';
import { UserActions } from './../actions/user.actions';
import { LoadingService } from './../services/loader.service';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Network } from '@ionic-native/network';
import { enableProdMode } from '@angular/core';
import { CameraHealthListMenu } from '../pages/camerahealth/camerahealth';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { EventLogPage } from '../pages/eventlog/eventlog';
import { Splash } from '../pages/splash/splash';
import { timer } from 'rxjs/observable/timer';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
import moment from 'moment-timezone';

enableProdMode();
@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  userSubscription
  showSplash = true; // <-- show animation
  rootPage: any = Login;
  //rootPage: any = Splash;
  pages: Array<{ title: string, component: any }>;
  navSubscription: Subscription;
  enableMenu = false;
  private prevPage: number;
  private backTapTime: Date;
  private currPage: number;
  public isOnline: boolean = true;
  public isLoggedIn: boolean;
  public isNetworkSubscribed: Subscription;
  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;
  private offlineToast: any;
  private isTutorialDone: boolean;
private idelSubscription: Subscription;
momentjs: any = moment;
private onResumeSubscription: Subscription;
  constructor(
    public platform: Platform,
    private store: Store<IAppState>,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private statusBar: StatusBar,
    private splashscreen: SplashScreen,
    private ionicApp: IonicApp,
    private navActs: NavigationActions,
    private userActions: UserActions,
    private cd: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private loaderService: LoadingService,
    private CustomAlert: AlertController,
    //public push: Push,
    private network: Network,
    public idle: Idle
  ) {
    this.userSubscription = this.store.select(function (state) {
      return state;

    })
      .subscribe(state => {
        if (state && state.navigation) {
          this.prevPage = state.navigation.prevPage;
          this.currPage = state.navigation.Page;
        }
        if (state && state.user) {
          this.isLoggedIn = state.user.IsLoggedin;
          window.localStorage.isLoggedIn = state.user.IsLoggedin;
        }
        this.cd.markForCheck();
      });

    this.initializeApp = this.initializeApp.bind(this);
       this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashscreen.hide();  // <-- hide static image

      timer(3000).subscribe(() => this.showSplash = false) // <-- hide animation after 3s
      this.initializeApp(modalCtrl);
    });
  this.pages = [
      { title: 'Page One', component: Login },
      { title: 'Page Two', component: HomePage }
    ]; 
    if(window.localStorage.getItem('isLoggedIn') === 'true') {

      this.checkingSessionTimeOut();
      
    }
    this.onResumeSubscription = this.platform.resume.subscribe(() => {
      //checking the logout time
      this.checkingSessionTimeOut();
      
   });

  }
  showError(e: any): void {
    let alert = this.alertCtrl.create({
      buttons: ['OK'],
      subTitle: e.error,
      title: e.title || 'Pro-Vigil'
    });
    alert.present();
  }
  checkingSessionTimeOut(){
    let curentTimeStamp = this.momentjs.utc().format('x');
    console.log(window.localStorage.keeploggedIn)
    if(curentTimeStamp >= Number(window.localStorage.loginTime) && window.localStorage.loginTime !== undefined 
    &&  window.localStorage.keeploggedIn=== "false") {
      localStorage.removeItem('loginTime');
       this.store.dispatch(this.userActions.logout());
       setTimeout(() => {
        let alert = this.CustomAlert.create({
          message: "Session Expired. Please login again",
          title: "Alert",
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
       } , 1500)
    }
  }
  showInformation(message: string, onDismiss?: Function): void {
    let alert = this.alertCtrl.create({
      buttons: [
        {
          handler(): void {
            if (onDismiss) {
              onDismiss();
            }
          },
          text: 'OK'
        }
      ],
      subTitle: message,
      title: 'Pro-Vigil'
    });
    alert.present();
  }

  navigateTo(navigation: Navigation): void {
    if (this.isOnline) {
      switch (navigation.PageType) {
        case NavigationType.ERROR:
          this.showError(navigation.NavParams);
          return;
        case NavigationType.INFO:
          this.showInformation(
            navigation.NavParams.message,
            navigation.onDismiss
          );
          return;
        default:
          break;
      }
      let page = this.getPage(navigation.Page);
      if (!page) {
        // NO PAGE PROVIDED
        return;
      }

      if (navigation.PageType === NavigationType.DIALOG) {
        let modal: Modal = this.modalCtrl.create(page, navigation.NavParams);
        // if (navigation.onDismiss) {
        //   modal.onDidDismiss(navigation.onDismiss);
        // }
        modal.present();
      } else if (navigation.PageType === NavigationType.GO_BACK) {
        this.nav.pop();
      } else {
        if (navigation.clearHistory) {
          this.nav.setRoot(page, navigation.NavParams);
        } else if (navigation.replace) {
          let length = this.nav.length();
          this.nav.push(page, navigation.NavParams).then(() => {
            this.nav.remove(length - 1);
          });
        } else {
          this.nav
            .push(page, navigation.NavParams)
            .then(() => {
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    } else {
      this.showOfflineAlert();
    }
  }
  showOfflineAlert() {
    let alert = this.CustomAlert.create({
      message: "Sorry, no internet connectivity detected. Please reconnect and try again.",
      title: "Connection Lost ",
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

  getPage(navigation: Pages): any {
    switch (navigation) {
      case Pages.PHONE:
        return UserPhonePage;
      case Pages.LOGIN:
        return Login;
      case Pages.HOME:
        return HomePage;
      case Pages.VIDEOPAGE:
        return VideoPage;
      case Pages.CAMERA:
        return CameraPage;
      case Pages.SIGNUP:
        return CreateAccount;
      case Pages.ARM_DISARM_INFO:
        return ArmDisarmInfo;
      case Pages.EVENT_LIST:
        return EventListPage;
      case Pages.POTENTIAL_LIST_MENU:
        return PotentialListMenu;
      case Pages.PLAY_VIDEO:
        return PlayVideo;
      case Pages.SETTING:
        return SettingsPage;
      case Pages.ABOUT_US:
        return AboutUsPage;
      case Pages.MONITOR:
        return MonitorPage;
      case Pages.CAMERA_LIST_MENU:
        return CameraListMenu;
      case Pages.STATS:
        return StatsPage;
      case Pages.CAM_HEALTH:
        return CameraHealthListMenu;
      case Pages.PIN:
        return PinPage;
      case Pages.MANAGE_ALARMS:
        return TicketingPage;
      case Pages.ALARMS:
        return Alarms;
      case Pages.SETUP_PIN:
        return SetupPinPage;
      case Pages.NOTIFICATION_PAGE:
        return NotificationsPage;
      case Pages.BALANCE_DUE_PAGE:
        return BalanceDuePage;
      case Pages.ABOUT_US_PAGE:
        return AboutusPage;
      case Pages.CAMERA_HD_VIEW_PAGE:
        return CameraHdViewPage;
      case Pages.EVENT_LOG:
          return EventLogPage;
      case Pages.EVENT_LOG_DETAIL:
        return EventlogDetailPage;
      case Pages.SITES_LIST:
        return SitesListPage;
      case Pages.MASK_IMAGES:
        return MaskingPage;
      default:
        return undefined;
    }
  }

  updateMenu(page: Pages): void {
    this.enableMenu = this.isMenuRequired(page);
  }

  isMenuRequired(page: any): boolean {
    switch (page) {
      case Pages.HOME:
        return true;
      default:
        return false;
    }
  }

  confirmExit(self: MyApp): void {
    let alert = this.alertCtrl.create({
      buttons: [
        {
          text: 'Cancel'
        },
        {
          handler(): void {
            self.platform.exitApp();
          },
          text: 'OK'
        }
      ],
      subTitle: 'Are you sure you want to Exit?',
      title: 'Pro-Vigil'
    });
    alert.present();
  }
  presentOfflineToast() {
    let toast = this.toastCtrl.create({
      message: 'Device offline. Please check network.',
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  initializeApp(modalCtrl): void {

    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.store.dispatch(this.userActions.isOffline(true));
     this.presentOfflineToast()
    });
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.store.dispatch(this.userActions.isOffline(false));
    //  this.presentOfflineToast()
    });

    this.statusBar.overlaysWebView(false);
    this.statusBar.styleBlackTranslucent();
    // if(this.platform.is('ios')){
    //   this.statusBar.hide();
    // }
     //this.splashscreen.hide();
    this.store.select(s => s.user).subscribe(user => {
      /* for pin fun comment if (this.isTutorialDone !== (!user.hasSeenTutorial && !user.userData.hasPin)) {
        this.isTutorialDone = (!user.hasSeenTutorial && !user.userData.hasPin);
      } */
      if (this.isTutorialDone !== !user.hasSeenTutorial) {
        this.isTutorialDone = user.hasSeenTutorial;
      }
    });
    this.store.select(s => s.navigation).subscribe(navigation => {
      if (!navigation) {
        return;
      }
      this.navigateTo(navigation as Navigation);

      // To Enable for New Splash 

      //  let splash = modalCtrl.create(Splash);
      //  splash.present();

      // To Enable for New Splash 
      
    });

    this.platform.registerBackButtonAction(e => {
      let activePortal =
        this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        // MODAL DIALOG
        activePortal.dismiss();
        return;
      }
      if (this.nav.canGoBack()) {
        // PAGE STACK
        // this.nav.pop();
        if (this.currPage === Pages.LOGIN) {
          this.platform.exitApp();
          return;
        } else if (this.currPage === Pages.HOME) {
          if (this.backTapTime) {
            let currentTime = new Date().getTime();
            let prevTime = this.backTapTime.getTime();
            if (currentTime - prevTime <= 10000) {
              this.platform.exitApp();
            }
            else {
              this.backTapTime = new Date();
            }
          } else {
            this.backTapTime = new Date();
          }
          return;
        }
        this.store.dispatch(this.userActions.potentialListInActive());
        this.store.dispatch(this.userActions.cameraListInActive());
        this.store.dispatch(this.navActs.navigateToPage(this.prevPage));
        return;
      }
      this.confirmExit(this);
    });

    this.nav.viewDidEnter
      .map(vc => vc.component)
      .subscribe(page => {
        return this.updateMenu(page)
      });

  /*     this.nav.viewDidLoad
      .map(vc => vc.component)
      .subscribe(page => {
          if(window.localStorage.isLoggedIn  === 'true') {
            console.log('subscribed-idel')
            this.manageIdelTime();
          }else{
            this.idle.stop();
            this.idle.ngOnDestroy();
          }
      }); */

      this.nav.viewWillLeave
      .map(vc => vc.component)
      .subscribe(page => {
        this.userSubscription.unsubscribe();
      });
  }
  openPage(page): void {
    this.nav.setRoot(page.component);
  }
  /* ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  } */
  /* managing the idel time of the user starts here*/

  manageIdelTime(){
    console.log('chari-flag', this.isLoggedIn );
    this.idle.setIdle(5);  //after 5 sec idle
    this.idle.setTimeout(0.5*60);  //5min countdown
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idelSubscription = this.idle.onTimeout.subscribe(() => {
      this.store.dispatch(this.userActions.logout());
    });
    //this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    //this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    this.idle.onTimeoutWarning.subscribe((countdown) => {
    let data=countdown/60;
    let min=data.toString().split('.')[0];
    let sec=     parseFloat(0+'.'+data.toString().split('.')[1])*60;
    sec=  (Math.round(sec * 100) / 100);
    console.log(countdown)
    //this.idleState = `You'll logout in '${this.min}' min '${this.sec}'  seconds!`;
    });

    this.resetIdelTime();
}
resetIdelTime() {
  this.idle.watch();
}
  /* Managing the idel time of the user ends here */
  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
}
