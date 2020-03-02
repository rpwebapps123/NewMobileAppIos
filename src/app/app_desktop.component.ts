import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
/************************************************************************************** */
import { UserActions } from './../actions/user.actions';
import { CameraActions } from './../actions/camera.actions';
import { EventsActions } from './../actions/events.action';
import { MonitorActions } from './../actions/monitor.actions';
import { StatsActions } from './../actions/stats.actions';

/************************************************************************************** */

import {
  Nav, Platform, ModalController,
  Modal, AlertController, IonicApp, ToastController, NavController, Events
} from 'ionic-angular';
//import { StatusBar, Splashscreen } from 'ionic-native';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers';
import {
  HomePage, UserPhonePage, CreateAccount, MonitorPage, Login,
  ArmDisarmInfo, CameraListMenu, VideoPage, CameraPage,
  PotentialListMenu, PlayVideo, StatsPage, SettingsPage, AboutUsPage, PinPage, TicketingPage, EventListPage, Alarms, BalanceDuePage, NotificationsPage, SetupPinPage
} from '../pages';
import { PotentialList, IDateRange, Navigation, NavigationType, SignupDetails, CameraList } from '../models';
import { Pages, NavigationActions } from '../actions/navigation.actions';
import { stat } from 'fs';
import { LoadingService } from './../services/loader.service';
import { Device } from '@ionic-native/device';
import orderBy from 'lodash/orderBy';
import { Slides } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import moment from 'moment';



@Component({
  templateUrl: 'app_desktop.html',
  // styleUrls: ['app_desktop.scss'],
  selector: 'app_desktop'
})
export class MyAppDesktop {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Slides) slides: Slides;

  rootPage: any = Login;
  pages: Array<{ title: string, component: any }>;
  navSubscription: Subscription;
  enableMenu = false;
  /************************************** */
  private userSubscription: Subscription;
  private armCamera: boolean;
  private armCameraColor: string;
  private enable: boolean = true;
  private potentialID: string;
  private activePotential: PotentialList;
  private armCameraClass: string = 'icon-lockopen';
  private armCameraText: string = 'icon-lockopen';
  private armCameraReverseText: string = 'icon-lockopen';
  private siteName: string;
  private isLoggedIn: boolean = false;
  private serviewArmCamera: boolean;
  private camActiveClass: string;
  private eventActiveClass: string;
  private monitorActiveClass: string;
  private videoActiveClass: string;
  private camActive: boolean;
  private userName: string;
  private eventActive: boolean;
  private monitorActive: boolean;
  private videoActive: boolean;
  private hasPin: boolean;
  private isPinVerified: boolean = true;
  private armInfo: Array<any> = [];
  private armData: any;
  private showTutorial: boolean = false;
  private armStatus: number;
  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;

  /*************************************** */
  constructor(
    public platform: Platform,
    private store: Store<IAppState>,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private statusBar: StatusBar,
    private splashscreen: SplashScreen,
    private ionicApp: IonicApp,
    private loaderService: LoadingService,
    /************************************** */
    private userActions: UserActions,
    private cameraActions: CameraActions,
    private eventActions: EventsActions,
    private monitorActions: MonitorActions,
    private statsActions: StatsActions,
    private navActs: NavigationActions,
    private device: Device,
    private cd: ChangeDetectorRef,
    private network: Network,
    private toastCtrl: ToastController,
    private events: Events
    /************************************** */

  ) {
    alert(1);
    this.initializeApp = this.initializeApp.bind(this);
    this.platform.ready().then(() => {
      this.initializeApp(modalCtrl);
    });
    this.pages = [
      { title: 'Page One', component: HomePage },
      { title: 'Page Two', component: Login },
      { title: 'Page Three', component: CameraPage }
    ];
    this.camActive = true;
    this.videoActive = false;
    this.monitorActive = false;
    this.eventActive = false;
  }
  showError(e: any): void {
    let alert = this.alertCtrl.create({
      buttons: ['OK'],
      subTitle: e.error,
      title: e.title || 'Pro-Vigil'
    });
    alert.present();
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
      title: 'Provigil'
    });
    alert.present();
  }
  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  navigateTo(navigation: Navigation): void {
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
        this.nav.setRoot(page, {}).then(() => {
          this.nav.remove(length - 1);
        });
      } else {
        // this.loaderService.showLoader();
        this.nav
          .setRoot(page, {})
          .then(() => {
            // this.loaderService.hideLoader();
          })
          .catch(e => {
            // this.loaderService.hideLoader();
          });
      }
    }
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

      default:
        return undefined;
    }
  }

  updateMenu(page: Pages): void {
    this.enableMenu = this.isMenuRequired(page);
  }

  isMenuRequired(page: any): boolean {
    switch (page) {
      case Pages.LOGIN:
        return true;
      default:
        return false;
    }
  }

  confirmExit(self: MyAppDesktop): void {
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


    this.statusBar.styleDefault();
    this.splashscreen.hide();

    this.store.select(s => s.navigation)
      .subscribe(navigation => {
        if (!navigation) {
          return;
        }
        this.navigateTo(navigation as Navigation);
      });


    this.platform.registerBackButtonAction((e) => {
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
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
        this.nav.pop();
        return;
      }
      this.confirmExit(this);
    });
            
    this.nav.viewDidEnter.map(vc => vc.component)

    this.userSubscription = this.store.select(store => ({ user: store.user, potential: store.potential, monitor: store.monitor }))
      .subscribe(state => {
        if (state.user && state.user.IsLoggedin && state.potential && state.potential.activePotential) {
          this.isLoggedIn = state.user.IsLoggedin;
          this.armCamera = state.user ? state.user.armCamera : false;
          this.serviewArmCamera = state.user ? state.user.serviewArmCamerea : false;
          this.activePotential = state.potential.activePotential;
          this.siteName = state.potential.activePotential.siteName;
          this.potentialID = state.potential.activePotential.potentialId || '';
          if (state.monitor && state.monitor.MonitoringStatusData) {
            this.armStatus = state.monitor.MonitoringStatusData.status;
          }
          this.armCameraClass = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'icon-lock ' : 'icon-lockopen';
          const prevState = this.armCameraText;
          this.armCameraText = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'ARMED' : 'DISARMED';
          // this.armCameraText = state.user.armCamera === false ?  'DISARMED' : 'ARMED';
          this.armCameraReverseText = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'Tap to Disarm' : 'Tap to Arm';
          // this.armCameraReverseText = state.user.armCamera === false ?  'Tap to Arm' : 'Tap to Disarm';
          this.armCameraColor = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'armCamerared ' : 'armCameragreen';
          
          // this.armCameraClass = state.user.armCamera === false ? 'icon-lockopen' : 'icon-lock ';
          // this.armCameraColor = state.user.armCamera === false ? 'armCameragreen' : 'armCamerared ';
          this.camActiveClass = this.camActive === true ? 'active' : '';
          this.eventActiveClass = this.eventActive === true ? 'active' : '';
          this.monitorActiveClass = this.monitorActive === true ? 'active' : '';
          this.videoActiveClass = this.videoActive === true ? 'active' : '';
          this.hasPin = state.user.userData.hasPin;
          if ((this.isPinVerified === false) && state.user.isPinVerified) {
            this.sendArmDisarmApiCall();
          }

          if (this.armCameraText !== prevState) {
            // setTimeout(() => {
            //   this.store.dispatch(this.userActions.getArmDisArmInfo({
            //     fdate: String(new Date().getMonth() + 1) + '/' + (new Date().getDate() - 2 + '/' + new Date().getFullYear()),
            //     tdate: String(new Date().getMonth() + 1) + '/' + ((new Date().getDate()) + '/' + new Date().getFullYear()),
            //     sitename: this.activePotential.siteName
            //   }));
            // }, 1500);
            
          }        
          

          if (state.user.armDisArmInfo && state.user.armDisArmInfo.length) {
            this.armInfo = state.user.armDisArmInfo;
            if (this.armInfo && this.armInfo.length) {
              const armDataList = this.armInfo.filter(armData => armData.eventType === 'DEACTIVATE');
              if (armDataList.length) {
                this.armData = armDataList[armDataList.length - 1];
              }
            }
            this.cd.markForCheck();
          }



          if ((!state.user.hasSeenTutorial && !state.user.userData.hasPin) || state.user.showTutorialAgain) {
            this.showTutorial = true;
            this.cd.detectChanges();
          }
          if ((state.user.hasSeenTutorial || state.user.userData.hasPin) && (!state.user.showTutorialAgain)) {
            this.showTutorial = false;
          }
          this.isPinVerified = state.user.isPinVerified;
          if (state.user.userData && state.user.userData.provigilUserData && state.user.userData.provigilUserData.userName) {
            this.userName = state.user.userData.provigilUserData.userName;
          }
        }
        // if (state.user && state.user.armDisArmInfo) {
        //   if (state.user && state.user.armDisArmInfo && state.user.armDisArmInfo.length) {
        //     this.armInfo = state.user.armDisArmInfo.reverse();
        // } else {
        //     this.armInfo = [];
        // }
        //   this.cd.markForCheck();
        // }
        this.cd.detectChanges();
      });
  }

  openPage(page): void {
    this.nav.setRoot(page.component);
  }
  armCameraNow() {
    if (navigator.onLine) {
      if (this.hasPin) {
        this.presentPinPrompt();
      } else {
        this.store.dispatch(this.navActs.navigateToPage(Pages.SETUP_PIN));
      }
    } else {
      this.showToast('You are currently offline. Please try again when online.');
    }
  }
  private getUserName(historyItem: any): string {
    const { userId, source } = historyItem;
    if (source === "MOBILE") {
      return (userId.substring(9, userId.length));
    } else {
      return userId;
    }
  }

  raiseCloseEvent(){
    this.events.publish('sidearea:clicked');
  }

  presentPinPrompt() {
    if (navigator.onLine) {
      this.store.dispatch(this.userActions.verifyPinReset())
      let alert = this.alertCtrl.create({
        title: 'PIN Verification',
        inputs: [
          {
            name: 'pin',
            placeholder: 'Enter your PIN',
            type: 'password'
          },
        ],
        cssClass: 'custum_alert two-btn-alert',
        buttons: [
        
          {
            text: 'Verify',
            handler: pin => {
              this.store.dispatch(this.userActions.verifyPin(pin));
            }
          },
          {
            text: 'Cancel',
            cssClass: 'cancel-button',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    } else {
      this.showToast('You are currently offline. Please try again when online.');
    }
  }
  sendArmDisarmApiCall() {
    if (!this.activePotential.surview) {
      let armDisarmData = (Number(this.armStatus) === 1) ?
        {
          action: 'DEACTIVATE',
          potentialId: this.activePotential.potentialId,
          deviceId: this.userName,
          messageText: 'fromDashboard',
          amPm: 'PM',
          untilHour: '01',
          untilMin: '00',
          activePotential: this.activePotential
        }
        : {
          action: 'ACTIVATE',
          potentialId: this.activePotential.potentialId,
          deviceId: this.userName,
          activePotential: this.activePotential
        }

      //this.store.dispatch(this.userActions.userArmCamera(armDisarmData));
      this.isPinVerified = true;
    } else {
      if (this.serviewArmCamera) {
        this.store.dispatch(this.userActions.surviewDisArmCamera({
          groupid: this.activePotential.groupid,
          rearmin: 43200,
          disarmreasonid: 2,
          auth: '5B4B617FE68D9F24E8EAB55CA892EA863840E2D149C4028864D8119200853B8192867F02433698704A7B4D6B56E40226'
        }));
      } else {
        this.store.dispatch(this.userActions.surviewArmCamera({
          groupid: this.activePotential.groupid,
          auth: '5B4B617FE68D9F24E8EAB55CA892EA863840E2D149C4028864D8119200853B8192867F02433698704A7B4D6B56E40226'
        }));
      }
      this.store.dispatch(this.userActions.getSurviewArmState({
        url: this.activePotential.url + 'CameraService',
        potentialid: this.activePotential.potentialId,
        event: 'MonitoringStatus'
      }));
    }
    this.cd.detectChanges();
  }
  enableSubmit() {
    this.enable = true;
  }
  navigateToCameraPage() {
    if (this.enable) {
      this.enable = false;
      this.camActive = true;
      this.videoActive = false;
      this.monitorActive = false;
      this.eventActive = false;
      this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
      setTimeout(() => { this.enableSubmit() }, 1000);
    } else {
      return false;
    }
  }
  dismissTutorial() {
    this.store.dispatch(this.userActions.setUserSeenTutorial());
  }
  // nextTutorial() {
  //   this.store.dispatch(this.userActions.setUserSeenTutorial());
  // }
  navigateToSettingPage(event) {
    this.store.dispatch(this.navActs.navigateToPage(Pages.SETTING));
  }
  navigateToManageAlarmPage() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.MANAGE_ALARMS));
  }
  navigateToShedulingPage() {
    this.camActive = false;
    this.videoActive = false;
    this.monitorActive = false;
    this.eventActive = true;
    this.store.dispatch(this.navActs.navigateToPage(Pages.ALARMS));
  }
  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }
  navigateToNotifications() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.NOTIFICATION_PAGE));
  }
  navigateToStatsAndEventsPage() {
    this.camActive = false;
    this.videoActive = true;
    this.monitorActive = false;
    this.eventActive = false;
    this.store.dispatch(this.eventActions.fetchSiteStats({
      action: 'STATS',
      potentialId: this.potentialID,
      device: this.device.uuid ? this.device.uuid : 'webBrowser',
      date: String(new Date().getUTCFullYear()) + '-' + String((new Date().getMonth()) + 1)
    }));

    this.store.dispatch(this.navActs.navigateToPage(Pages.STATS));
  }
  navigateToMonitorPage() {
    this.camActive = false;
    this.videoActive = false;
    this.monitorActive = true;
    this.eventActive = false;
    this.store.dispatch(this.navActs.navigateToPage(Pages.MONITOR));
  }

  lastArmedList() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.ARM_DISARM_INFO))
  }

  goToSlide() {
    let currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(currentIndex + 1);
  }

  getDefaultDates(): string[] {
    let endDate = new Date();
    let startDate = new Date((new Date().getTime()) - (7 * 24 * 60 * 60 * 1000)); //subtracting 7 days

    return [startDate.toISOString().substring(0, startDate.toISOString().indexOf('.')),   /*Converting date to ISO string since api accepts ISO strings*/
    endDate.toISOString().substring(0, endDate.toISOString().indexOf('.'))];
  }

  doReset(mobile: string) {
    // this.store.dispatch(this.userActions.resetPassword(mobile));
  }
  /************************************************************************************** */
}