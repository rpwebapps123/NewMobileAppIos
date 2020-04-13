import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Device } from '@ionic-native/device';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Store } from '@ngrx/store';
import { AlertController, ModalController, Nav, NavController, Platform, PopoverController, Slides, ToastController } from 'ionic-angular';
import moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { ArmStatusActions } from '../../actions/armstatus.actions';
import { CameraActions } from '../../actions/camera.actions';
import { EventListAction } from '../../actions/eventList.action';
import { EventsActions } from '../../actions/events.action';
import { MonitorActions } from '../../actions/monitor.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { StatsActions } from '../../actions/stats.actions';
import { UserActions } from '../../actions/user.actions';
import { AppConfig, isDesktop } from '../../config/appConfig';
import { Globals } from '../../config/globals';
import { PotentialList } from '../../models';
import { stateDetails } from '../../models/user';
import { IAppState } from '../../reducers';
import { PopupPage } from '../popup/popup';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})

export class HomePage {
    @ViewChild(Slides) slides: Slides;

    private userSubscription: Subscription;
    private armStatusSubscription: Subscription;
    private armCamera: boolean;
    private serviewArmCamera: boolean;
    private armCameraColor: string;
    private potentialID: string;
    private activePotential: PotentialList;
    private armCameraClass: string = 'icon-lockopen';
    private armCameraText: string = 'icon-lockopen';
    private armCameraReverseText: string = 'icon-lockopen';
    private siteName: string;
    private send: stateDetails;
    private userName: string;
    private armStatus: number;
    private siteStatus: number;
    private armInfo: Array<any> = [];
    private armData: any;
    private showTutorial: boolean = false;
    private hasPin: boolean = false;
    private isPinVerified: boolean = true;
    private isOnline: boolean = false;
    armStatusVal: string = '';
    private checkStatus: boolean = false;
    private unitId: string = '';
    private onlineText: string ='';
    private onlineStatus: number = 2;
    private isOnlineStatusFetch : boolean = true;
    private isMonitoringStatusFetch : boolean = true;
    private isStatusLoaded : boolean = false;
    private isIos : boolean = false;
    private source = "mobile";
    private notes = "";
    private url: string;
    private siteTimeZone: string;
    momentjs: any = moment;
    nextPsa: string;
    private alarmsList: any = {};
    pvmUser: string; 
    
    constructor(
        private navCtrl: NavController,
        public modalCtrl: ModalController,
        private store: Store<IAppState>,
        private userActions: UserActions,
        private armStatusActions: ArmStatusActions,
        private cameraActions: CameraActions,
        private eventActions: EventsActions,
        private monitorActions: MonitorActions,
        private statsActions: StatsActions,
        private CustomAlert: AlertController,
        private potentialActions: PotentialActions,
        private device: Device,
        private cd: ChangeDetectorRef,
        private eventListActions: EventListAction,
        private alertCtrl: AlertController,
        private navActs: NavigationActions,
       // public push: Push,
        public nav: Nav,
        public platform: Platform,
        private toastCtrl: ToastController,        
        private screenOrientation: ScreenOrientation,
        private popoverCtrl: PopoverController,
        public globals: Globals,
        private localNotif: LocalNotifications ) {
        platform.ready().then(() => {
            if (!isDesktop) {
                if (AppConfig.isScreenLock) {
                    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
                }
            }
               //et msg = (this.globals.isPvmUser)?'Welcome PVM User':'Welcome I Vigil User';
               //this.showToast(msg);
               /* checking the local notifications start here*/
            /*     this.localNotif.on('click').subscribe((res)=>{
                    let msg = res.data? res.data.page:'';
                    this.showAlert(res.title,msg);
              });
              this.localNotif.on('trigger').subscribe((res)=>{
                let msg = res.data? res.data.page:'';
                this.showAlert(res.title,msg);
              }) */
               /* checking the local notifications end here */

            }).catch(err => {
                console.log('Error while loading platform', err);
        });
        try {
            this.pvmUser = window.localStorage.isPvmUser;
            let ctOffset = this.momentjs.tz('America/Chicago').format('Z');
            window.localStorage.ctTime = ctOffset;
             console.log('chari-check', window.localStorage.ctTime);  //getting the offset
            console.log('userType', this.pvmUser);
        this.userSubscription = store.select((state) => ({ user: state.user, potential: state.potential, monitor: state.monitor }))
            .subscribe(state => {
                this.armCamera = state.user ? state.user.armCamera : false;
                //this.armStatusVal = state.user ? state.user.armStatusVal : '';
                this.serviewArmCamera = state.user ? state.user.serviewArmCamerea : false;
                this.activePotential = state.potential.activePotential;
                this.siteName = state.potential.activePotential ? state.potential.activePotential.siteName : '';
                this.potentialID = state.potential.activePotential.potentialId || '';
                this.unitId = (state.potential.activePotential && state.potential.activePotential.unitId) ? state.potential.activePotential.unitId : '';
                this.siteTimeZone =  state.potential.activePotential.timezone;
               if(state.user && state.user.alarmList) {
                    window.localStorage.isLoggedIn = state.user.IsLoggedin;
                    this.alarmsList =  state.user.alarmList;
                    console.log('list-alarm-before-sort', state.user.alarmList);
                    if ((state.user.alarmList !== undefined) && (state.user.alarmList).length > 0 ) {
                        console.log('chari-loop', 'test');
                        let currentDateTime = this.momentjs(this.momentjs.utc()).tz(this.getTimeZoneName(this.siteTimeZone).name).format('YYYY-MM-DD HH:mm:ss');
                        this.alarmsList = state.user.alarmList.filter((item) => {
                            let psaDate = this.convertCtToLocal(item.StartDateTime);
                            let result = this.momentjs(psaDate).diff(moment(currentDateTime), 'minutes');
                            console.log('test-result', result);
                           return (result <= 60 && result > 0) ?  true : false;
                        });
                    }
                     console.log('list-alarm-after-sort',    this.alarmsList);
                   this.nextPsa = this.alarmsList[0] ? this.alarmsList[0].StartDateTime : '';
                    window.localStorage.nextPsa = this.nextPsa;
               }
                 if(state.user && state.user.onlineText) {
                    this.onlineText = state.user.onlineText;
                    this.isOnlineStatusFetch = false;
                 }
                 this.url = state.potential.activePotential.url || '';
                 if(state.user && state.user.onlineStatus){
                    this.onlineStatus = state.user.onlineStatus;
                 }
 
                //this.hasPin = state.user.userData.hasPin;
                //if ((this.isPinVerified === false) && state.user.isPinVerified) {
                if ((this.isPinVerified === false)) {
                    setTimeout(() => {
                        this.sendArmDisarmApiCall();
                       this.store.dispatch(this.userActions.verifyPinReset());
                    }, 500);
                }
                //this.isPinVerified = state.user.isPinVerified;  

                if(state.user.userData && state.user.userData.provigilUserData && state.user.userData.provigilUserData.userName){
                    this.userName = state.user.userData.provigilUserData.userName;
                }
                if(state.user.userData && state.user.userData.userName) {
                    this.userName = state.user.userData.userName;
                }
            });
            this.armStatusSubscription = store.select((state) => ({ armstatus: state.armStatus }))
            .subscribe(state => {
                console.log('state', state);
                if(window.localStorage.armStatus && window.localStorage.armStatus != "undefined"){
                    this.armStatus = window.localStorage.armStatus;
                }
                if(state.armstatus &&  state.armstatus.MonitoringStatusData &&  !this.isEmpty(state.armstatus.MonitoringStatusData)){
                     this.isMonitoringStatusFetch = false;
                    this.armStatus = state.armstatus.MonitoringStatusData.status;
                    window.localStorage.siteTime = state.armstatus.MonitoringStatusData.serverTime;
                    state.armstatus.MonitoringStatusData = null;  // commented by chari
                    window.localStorage.armStatus = this.armStatus;
                }
                    if( this.siteStatus === undefined || state.armstatus.siteStatus === undefined) {
                        this.siteStatus =  this.armStatus;
                    } else {
                        this.siteStatus =  state.armstatus.siteStatus;
                    }
                    console.log('checking-status chari' ,   this.siteStatus);
                    this.armCameraText = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'ARMED' : 'DISARMED';
                    this.armCameraColor = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'armCamerared' : 'armCameragreen';
                    this.armCameraReverseText = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'Tap to Disarm' : 'Tap to Arm';
                    this.armCameraClass = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'icon-lock' : 'icon-lockopen';
                    this.checkStatus = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? true : false;
                if (state.armstatus.armDisArmInfo && state.armstatus.armDisArmInfo) {
                    this.armInfo = state.armstatus.armDisArmInfo;
                    this.armData = this.armInfo[0];
                    this.cd.markForCheck();
                }
            });
            if(!window.localStorage.seenTutorial){
                this.showTutorial = true;
                window.localStorage.seenTutorial = true;
            }else{
                this.showTutorial = false;
            }

        } catch(e){
            console.log('Error',e);
        }
    }
    getNextPsaMinutes() {
        console.log('nextPSA', this.nextPsa);
        let result:number = 61;
        if(this.nextPsa) {
            let psaDate = this.convertCtToLocal(this.nextPsa);
            let currentDateTime = this.momentjs(this.momentjs.utc()).tz(this.getTimeZoneName(this.siteTimeZone).name).format('YYYY-MM-DD HH:mm:ss');
            result = this.momentjs(psaDate).diff(moment(currentDateTime), 'minutes');
        }
        return result;
    }
    private convertUtcToLocal(date: string) {
        let splitString = date.split('T');
        let customDate = splitString[0];
        let customTime = splitString[1].split('.')[0];
        let customDateTime = customDate + 'T' + customTime;
      const offsetName = this.getTimeZoneName(this.siteTimeZone).name;
       this.momentjs.tz.setDefault(offsetName);
      let convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).tz(offsetName).format('YYYY-MM-DD HH:mm:ss');
       return convertedTime;
   }
   private convertCtToLocal(date: string) {
       console.log('sample-data', date);
    let splitString = date.split('T');
    let customDate = splitString[0];
    let customTime = splitString[1].split('.')[0];
    let customDateTime = customDate + 'T' + customTime;
//  const ctOffsetName = this.getTimeZoneName('CT').name;
 //  this.momentjs.tz.setDefault(ctOffsetName);
 let ctOffset =  (window.localStorage.ctTime).replace(':00','');
 ctOffset = Math.abs(Number(ctOffset));
  let convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).subtract(ctOffset, 'hours').format('YYYY-MM-DD HH:mm:ss');
   return convertedTime;
}
    showAlert = (message: string, title: string) => {

        let alert = this.CustomAlert.create({
            message: message,
            title: title,
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
    showPsaAlert = (message: string, title: string) => {

        let alert = this.CustomAlert.create({
            message: message,
            title: title,
            enableBackdropDismiss: false,
            cssClass: 'custum_alert',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.presentModal();
                }
            }]
        });
        alert.present();
    }
    isEmpty(obj) {
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop)) {
            return false;
          }
        }
      
        return JSON.stringify(obj) === JSON.stringify({});
      }
    ionViewDidEnter() {

            this.store.dispatch(this.userActions.potentialListInActive());
            this.store.dispatch(this.cameraActions.hideHeader(false));   
            this.store.dispatch(this.cameraActions.setHeader(this.siteName));
            this.isMonitoringStatusFetch = true;
            this.store.dispatch(this.armStatusActions.getArmDisArmStatusInfo({
                fdate: String(new Date().getMonth()) + '/' + (new Date().getDate() + '/' + new Date().getFullYear()),
                tdate: String(new Date().getMonth() + 1) + '/' + ((new Date().getDate()) + '/' + new Date().getFullYear()),
                sitename: this.activePotential.siteName,
                event: 'MonitoringStatus', potentialid: this.activePotential.potentialId 
            }));
        // this.store.dispatch(this.userActions.getCameraStatusInfo({          
        //     unitId: this.unitId,
        //     event: 'MonitoringStatus', potentialid: this.activePotential.potentialId 
        // }));
        this.isOnlineStatusFetch = true;
           /*   this.store.dispatch(this.userActions.balanceDue({
                 sfAccountId: this.activePotential.sfaccountId
             }));      */
            this.cd.detectChanges();
            // this.store.dispatch(this.userActions.getArmState({
            //     potentialId: this.activePotential.potentialId,
            //     event: 'MonitoringStatus'
            // }));
            // this.store.dispatch(this.potentialActions.getActivePotential());
  
        //   /************** TEMP ********************** */
        // setTimeout(()=>{
        //     this.store.dispatch(this.userActions.logout());
        // },10000);
         //   /************** TEMP ********************** */
    }
    ionViewDidLoad() {
        this.isIos = this.platform.is('ios');
        // this.push.hasPermission()
        //     .then((res: any) => {

        //         if (res.isEnabled || this.platform.is('ios')) {
        //             this.initPushNotification();
        //         } else {
        //             console.log('We do not have permission to send push notifications');
        //         }
        //     })
        //     .catch((err) => {
        //         console.log('error occured', err);
        //     })
        this.seeSchedule();
    }
    navigateToCameraPage() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
    }
    navigateToSettingPage(event) {
        this.store.dispatch(this.navActs.navigateToPage(Pages.SETTING));
    }
    navigateToManageAlarmPage() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.MANAGE_ALARMS));
    }
    navigateToShedulingPage() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.ALARMS));
    }
    navigateToStatsPage() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.STATS));
    }
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
        this.armStatusSubscription.unsubscribe();
    }
    navigateToNotifications() {
            if(navigator.onLine){
                this.store.dispatch(this.navActs.navigateToPage(Pages.NOTIFICATION_PAGE));            
            }else{
                    this.showToast('You are currently offline.The notifications are not visible'); 
            }
    }
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
      }

    presentOfflineToast() {
        let toast = this.toastCtrl.create({
            message: 'Device offline. Please check network.',
            duration: 3000,
            position: 'top'
        });

        toast.present();
    }

    armCameraNow() {
            if (this.isOnline) {
                this.presentOfflineToast();
                return;
            }
            if (this.hasPin) {
                this.presentPinPrompt();
            } else {
                console.log('checking-status1', Number(this.armStatus), Number(this.siteStatus));
                 this.store.dispatch(this.armStatusActions.getSiteStatus({ potentialId: this.activePotential.potentialId, url: this.url, event: 'MonitoringStatus'}));
                 this.cd.detectChanges();
                setTimeout(() => {
                    console.log('checking-status2', Number(this.armStatus), Number(this.siteStatus));
                   /*  let psaMinutes = this.getNextPsaMinutes();
                    console.log('nextPSA', psaMinutes, this.siteStatus);
                    if((Number(this.siteStatus) === 1 || Number(this.siteStatus) === 2 || Number(this.siteStatus) === 3) && psaMinutes <= 60) {
                        this.showPsaAlert(` There is upcoming PSA in “${60-psaMinutes} mins”,Site will be disarmed in “${ 60-psaMinutes} mins”. `,'');
                    } else {
                        this.presentModal();
                    } */
                    if (Number(this.armStatus) !== Number(this.siteStatus)) {
                        let msg = (Number(this.siteStatus) === 0 || Number(this.siteStatus) === 4) ? 'ARMED' : 'DISARMED';
                        this.checkStatus = (Number(this.siteStatus) === 0 || Number(this.siteStatus) === 4) ? true : false;
                        this.armData.eventType = (Number(this.siteStatus) === 0 || Number(this.siteStatus) === 4) ? 'ACTIVATE' : 'DEACTIVATE';
                        window.localStorage.armStatus = this.siteStatus;
                       this.showAlert(`The site is already  ${msg} by Admin.`,'');
                    } else {
                        let psaMinutes = this.getNextPsaMinutes();
                        console.log('nextPSA', Number(psaMinutes), this.siteStatus);
                        if ((Number(this.siteStatus) === 0 || Number(this.siteStatus) === 4) && (psaMinutes <= 60 && psaMinutes > 0)) {
                            this.showPsaAlert(` There is upcoming PSA in “${psaMinutes} mins”,Site will be disarmed in “${ psaMinutes} mins”. `,'');
                        } else {
                            this.presentModal();
                        }
                    }
                }, 500);
            }
    }
    sendArmDisarmApiCall() {
            let armDisarmData = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ?
                {
                    action: 'DEACTIVATE',
                    potentialId: this.activePotential.potentialId,
                   // deviceId: this.userName,
                    deviceId: (this.pvmUser === 'true') ? this.userName : 'Mobile',
                   user: this.userName,
                    messageText: this.notes,
                  //  amPm: 'PM',
                  //  untilHour: '01',
                    //untilMin: '00',
                    sitename: this.activePotential.siteName,
                    source: this.source,
                    from:(this.pvmUser === 'true') ? 'undefined' : 'newmobileapp',
                }
                : {
                    action: 'ACTIVATE',
                    potentialId: this.activePotential.potentialId,
                    deviceId: (this.pvmUser === 'true') ? this.userName : 'Mobile',
                    user:this.userName,
                    sitename: this.activePotential.siteName,
                    source: this.source,
                    messageText: this.notes,
                    from:(this.pvmUser === 'true') ? 'undefined' : 'newmobileapp',
                    // deviceId: this.device.uuid ? this.device.uuid : 'webBrowser'
                }
                //alert(armDisarmData);
            this.store.dispatch(this.armStatusActions.userArmCamera(armDisarmData));
            //this.isPinVerified = true;
        this.cd.detectChanges();
    }
    /* Get PSA List  starts here */ 
    seeSchedule() {
        if(navigator.onLine){
            const offsetName = this.getTimeZoneName(this.siteTimeZone).name;
            let convertedTime = this.momentjs().tz(offsetName).format('YYYY-MM-DD');
            window.localStorage.isHomePage = 'true';
            let data = {
                accountid: this.activePotential.sfaccountId,
                FromDate: convertedTime,
                ToDate : convertedTime
            }
            this.store.dispatch(this.userActions.getAlarmToken(data));
            console.log('checking-status2', Number(this.armStatus), Number(this.siteStatus));
            
        } else {
            this.showToast('You are currently offline.The SEE SCHEDULE not deleted');
        }
    }

    private getTimeZoneName(timeZone: string) {
           /*
           Provigil Time Zones

           CT - UTC–06:00 Central Daylight Time (America/Chicago)
           ET - UTC–05:00 Eastern Daylight Time (America/New_York)
           MT -UTC–06:00 Mountain Daylight Time (America/Denver)
           MT-AZ - UTC–07:00 Mountain Standard Time (America/Phoenix)
           PT - UTC–07:00 Pacific Daylight Time ()
           BST - UTC+01:00 British Summer Time (Europe/London)
           HT - UTC–10:00 Hawaii-Aleutian Standard Time (Pacific/Honolulu)
           */
          
        switch (timeZone) {
            case 'CT': {
                return ({ name: 'America/Chicago', offset: '-06:00' });
            }
            case 'ET': {
                return ({ name: 'America/New_York', offset: '-05:00' });
            }
            case 'MT': {
                return ({ name: 'America/Denver', offset: '-07:00' });
            }
            case 'MT-AZ': {
                return ({ name: 'America/Phoenix', offset: '-07:00' });
            }
            case 'PT': {
                return ({ name: 'America/Los_Angeles', offset: '-08:00' });
            }
            case 'BST': {
                return ({ name: 'Europe/London', offset: '+01:00' });
            }
            case 'HT': {
                return ({ name: 'Pacific/Honolulu', offset: '-10:00' });
            }
        }
    }
/* Get PSA List Ends Here */
    navigateToMonitorPage() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.MONITOR));
    }

    presentPinPrompt() {
        this.store.dispatch(this.userActions.verifyPinReset());

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
                    handler: data => {
                        this.store.dispatch(this.userActions.verifyPin({'pin':data.pin, 'userName':this.userName}));
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
    }
    presentNotesPrompt() {

        let alert = this.alertCtrl.create({
            title: 'Notes',
            subTitle :'Sub-title',
            inputs: [
                
                {
                    name: 'notes',
                    placeholder: 'Enter Notes',
                    type: 'textarea'
                },
            ],
            cssClass: 'custum_alert two-btn-alert',
            buttons: [
        
                {
                    text: 'Yes',
                    handler: data => {
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
    }
    navigateToEquipmentHealthPage() {
        // this.store.dispatch(this.eventActions.fetchSiteStats({
        //     action: 'STATS',
        //     potentialId: this.potentialID,
        //     device: this.device.uuid ? this.device.uuid : 'webBrowser',
        //     date: String(new Date().getUTCFullYear()) + '-' + String((new Date().getMonth()) + 1)
        // }));

       // this.store.dispatch(this.navActs.navigateToPage(Pages.STATS));
       this.store.dispatch(this.navActs.navigateToPage(Pages.CAM_HEALTH));
    }

    getDefaultDates(): string[] {
        let endDate = new Date();
        let startDate = new Date((new Date().getTime()) - (7 * 24 * 60 * 60 * 1000)); //subtracting 7 days

        return [startDate.toISOString().substring(0, startDate.toISOString().indexOf('.')),   /*Converting date to ISO string since api accepts ISO strings*/
        endDate.toISOString().substring(0, endDate.toISOString().indexOf('.'))];
    }

    lastArmedList() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.ARM_DISARM_INFO))
    }
    dismissTutorial() {
       // this.store.dispatch(this.userActions.setUserSeenTutorial());
       this.showTutorial = false;
    }
    goToTutorialStart() {
        this.slides.slideTo(0, 2000);
    }
    navigateToTicketing() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.MANAGE_ALARMS));
    }

    navigateToEventLog() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.EVENT_LOG));
      }
      
      logout() {
        const alert = this.CustomAlert.create({
          title: 'Confirm!',
          message: 'Are you sure you want to logout?',
          cssClass: 'custum_alert two-btn-alert',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                if (navigator.onLine) {
                  try {
                    (<any>window).cookies.clear(function() {
                        //  alert('Cookies cleared!');
                      });
                      var success = function(status) {
                        //alert('Message: ' + status);
                    };
                    var error = function(status) {
                       // alert('Error: ' + status);
                    };
                    (<any>window).CacheClear(success, error);
                    const date = new Date();
                
                    // Set it expire in -1 days
                    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
                
                    // Set it
                    document.cookie = "JSESSIONID=; expires="+date.toUTCString()+"; path=/";
                    localStorage.clear();
                    localStorage.seenTutorial = true;
                    this.store.dispatch(this.userActions.logout());
                  } catch (e) {
    
                  }
                } else {
                  let networkAlert = this.CustomAlert.create({
                    message: 'Sorry, no internet connectivity detected. Please reconnect and try again.',
                    title: 'Connection Lost ',
                    enableBackdropDismiss: false,
                    cssClass: 'custum_alert',
                    buttons: [{
                      text: 'Ok',
                      handler: () => {
                        // alert.dismiss();
                      }
                    }]
                  });
                  networkAlert.present();
                }
              }
            },
            {
              text: 'Cancel',
              cssClass: 'cancel-button',
              role: 'cancel',
              handler: () => { }
            }
          ]
        });
        alert.present();
      }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopupPage);
        popover.present({
          ev: myEvent
        });
        popover.present();
    }
    presentModal() {
        let modal = this.modalCtrl.create(PopupPage, {'armdisarm': this.siteStatus}, { showBackdrop: true});
        modal.onDidDismiss(data => {
            if(data.modal_status === 1) {
                this.notes = data.notes;
                this.sendArmDisarmApiCall();
            }
          });
        modal.present();
    }
   /*  initPushNotification() {
        const options: PushOptions = {
          android: {
            senderID: '733357177429',
            forceShow: true,
            sound: true,
            clearNotifications: false,
            icon: '<img height="29" src="icon/ios/icon-small.png" width="29" />',
            iconColor: 'black',
          },
          ios: {
            alert: 'true',
            badge: false,
            sound: 'true'
          },
          windows: {}
        };
        const pushObject: PushObject = this.push.init(options);
          try {
              pushObject.on('registration').subscribe((data: any) => {
                  console.log('device token -> ' + data.registrationId);
                  //TODO - send device token to server
                    this.store.dispatch(this.userActions.sendDeviceToken(data.registrationId));
              });
          } catch (e) {
    
          }
          pushObject.on('notification').subscribe((data: any) => {
                if (!this.platform.is('cordova')) {
                  console.log('Skip showing push notification as not on mobile.');
                  return;
              }
              let confirmAlert = this.alertCtrl.create({
                  title: 'New Notification',
                  message: data.message,
                    buttons: [{
                      text: 'Ignore',
                      role: 'cancel'
                    }, {
                      text: 'View',
                      handler: () => {
                            this.store.dispatch(this.navActs.navigateToPage(Pages.NOTIFICATION_PAGE));
                      }
                  }]
              });
              confirmAlert.present();
          });
           pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
        } */
    getElaspsedMinutes(){
         let currentTime = moment().tz("America/Chicago").valueOf();
         let psaTime = moment.tz("2019-07-31 09:59","America/Chicago").valueOf(); 
    }
    millisToMinutesAndSeconds(millis) {
        let minutes = Math.floor(millis / 60000);
        let seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
        return minutes;
    }
}