import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';
import { AlertController, Platform, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { IAppState } from '../../reducers';
import { UserActions } from './../../actions/user.actions';
import { AppConfig, isDesktop } from './../../config/appConfig';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  userSubscription: Subscription
  header: string
  isNotificationsEnabled: boolean;
  disableNotification: boolean;
  hasPin: boolean;
  isOnline: boolean;
  private userName: string;
   isIos : boolean = false;
  versionNumber :string;
  isDesktopEnabled:boolean;
  constructor(private store: Store<IAppState>,
    private network: Network,
    private navActs: NavigationActions,
    private inAppBrowser: InAppBrowser,
    private toastCtrl: ToastController,
    private CustomAlert: AlertController,
    private userActions: UserActions,
    private callNumber: CallNumber,
    public platform: Platform,
    private appVersion: AppVersion
    ) {
      platform.ready().then(() => {
        this.isDesktopEnabled = isDesktop;
        if (isDesktop) {
          this.versionNumber = '1.4.6';
        } else {
         
          this.appVersion.getVersionNumber().then((res) => {
            this.versionNumber = res;
          });
        }
       }).catch(err => {

       });
    this.userSubscription = this.store.select(state => {
      return {
        user: state.user
      }
    }).subscribe(state => {
      this.hasPin = state.user.userData.hasPin;
      this.disableNotification = state.user.userData.disableNotification;

      if(state.user.userData && state.user.userData.provigilUserData && state.user.userData.provigilUserData.userName){
        this.userName = state.user.userData.provigilUserData.userName;
    }

    })
    this.network.onchange().subscribe((event) => {
      if (event.type === 'online') {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    })
   
  }

  ionViewDidLoad() {
    this.isNotificationsEnabled = !this.disableNotification;
    this.isIos = this.platform.is('ios');
  }

  navigateToAboutusPage() {

    if(navigator.onLine){
      const browser = this.inAppBrowser.create(AppConfig['pvmServiceRequests'].aboutUsUrl, '_blank', 'location=no');
      //this.store.dispatch(this.navActs.navigateToPage(Pages.ABOUT_US_PAGE, false, {}, Pages.SETTING));      
      }else{
        this.showToast('You are currently offline. Please try again when online.');  
      }

    // if(navigator.onLine){
    // const browser = this.inAppBrowser.create(AppConfig['pvmServiceRequests'].aboutUsUrl, '_self', 'location=no');        
    // //window.open(AppConfig['pvmServiceRequests'].aboutUsUrl, '_self', options);
      
    //   }else{
    //     this.showToast('You are currently offline. ABOUT US PAGE not visible');  
    //   }
  }

  navigateToBalanceDuePage() {
    if(navigator.onLine){
    this.store.dispatch(this.navActs.navigateToPage(Pages.BALANCE_DUE_PAGE, false, {}, Pages.SETTING));      
    }else{
      this.showToast('You are currently offline. Please try again when online.');  
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
  navigateToPinPage() {
      this.isOnline = (this.isOnline === null || this.isOnline === undefined) ? navigator.onLine : this.isOnline;
      if (this.isOnline) {
        if (this.hasPin) {
          let networkAlert = this.CustomAlert.create({
            message: 'Are you sure you want to reset your PIN?',
            title: 'Reset PIN',
            enableBackdropDismiss: false,
            cssClass: 'custum_alert two-btn-alert',
            buttons: [{
              cssClass: 'setting-border',
              text: 'Ok',
              handler: () => {
                this.store.dispatch(this.userActions.resetPin({'userName':this.userName}));
                // alert.dismiss();
              }
            },
            {
              text: 'Cancel',
              cssClass: 'cancel-button',
              role: 'cancel'
            }]
          });
          networkAlert.present();
        } else {
          let networkAlert = this.CustomAlert.create({
            message: 'Please set your PIN First',
            title: 'Reset PIN',
            enableBackdropDismiss: false,
            cssClass: 'custum_alert two-btn-alert',
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.store.dispatch(this.navActs.navigateToPage(Pages.SETUP_PIN));
                // alert.dismiss();
              }
            },
            {
              text: 'cancel',
              cssClass: 'cancel-button',
              role: 'cancel'
            }]
          });
          networkAlert.present();
        }
      } else {
        this.presentToast('Sorry you cannot reset PIN when offline.');
      }
  }

  toggleNotification(): void {
    if(navigator.onLine){
    this.store.dispatch(this.userActions.toggleNotification(this.isNotificationsEnabled));        
      }else{
        this.showToast('You are currently offline. Please try again when online.');  
      }
  }
  presentToast(str) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }


  navigateToTutorialPage() {
    if(navigator.onLine){
      this.store.dispatch(this.navActs.navigateToPage(Pages.ABOUT_US, false, {}, Pages.SETTING));
    } else {
          this.showToast('You are currently offline. Please try again when online.');  
        }
  }
  navigateToTicketing() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.MANAGE_ALARMS, false, {}, Pages.SETTING));
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
                localStorage.clear();
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

  callCustomerSupport(){
    this.callNumber.callNumber("866-616-1318", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
