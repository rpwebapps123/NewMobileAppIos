import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Store } from '@ngrx/store';
import { AlertController, Nav, Platform, PopoverController, Slides, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { ArmStatusActions } from '../../actions/armstatus.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { UserActions } from '../../actions/user.actions';
import { PotentialList } from '../../models/user';
import { IAppState } from '../../reducers';
import { PopupPage } from '../popup/popup';
import { AppConfig, isDesktop } from './../../config/appConfig';
import { Globals } from './../../config/globals';


@Component({
  selector: 'page-sites-list',
  templateUrl: 'sites-list.html'
})
export class SitesListPage {
  @ViewChild(Slides) slides: Slides;

  private userSubscription: Subscription;
  private armStatusSubscription: Subscription;
  private serviewArmCamera: boolean;
  private activePotential: PotentialList;
  private siteName: string;
  private userName: string;
  private armStatus: number; 
  private armInfo: Array<any> = [];
  private hasPin: boolean;
  private isOnline: boolean = false;
  armStatusVal: string = '';
  private unitId: string = '';
  showTutorial: boolean = false;
  private onlineText: string ='';
  private onlineStatus: number = 2;
  private isOnlineStatusFetch : boolean = true;
  isIos : boolean = false;
  list: any[] = [];
  private errorMessage:string ='';
  isDesktop = isDesktop;
  constructor(
    private store: Store<IAppState>,
    private userActions: UserActions,
    private armStatusActions: ArmStatusActions,
    private CustomAlert: AlertController,
    private cd: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private navActs: NavigationActions,
    public nav: Nav,
    public platform: Platform,
    private toastCtrl: ToastController,
    private screenOrientation: ScreenOrientation,
    private popoverCtrl: PopoverController,
    public globals: Globals,
    private potentialActions: PotentialActions
    ) {
      platform.ready().then(() => {
        if (!isDesktop) {
            if (AppConfig.isScreenLock) {
              this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
            }
        }
        }).catch(err => {
            console.log('Error while loading platform', err);
        });
         /** Loading the Tutorail screen default */
        if(!window.localStorage.seenTutorial){
          this.showTutorial = true;
          window.localStorage.seenTutorial = true;
        } else {
            this.showTutorial = false;
        }
    }
  ionViewDidLoad() {
    this.isIos = this.platform.is('ios');
  
  }
  ionViewDidEnter(){

    this.userSubscription = this.store.select((state) => ({ user: state.user, potential: state.potential, monitor: state.monitor }))
    .subscribe(state => {
        this.list = state.potential.list;
        if(this.list.length <1){
          this.errorMessage = 'No sites found';
        }
         if(state.user && state.user.onlineText){
            this.onlineText = state.user.onlineText;
            this.isOnlineStatusFetch = false;
         }
         if(state.user && state.user.onlineStatus){
            this.onlineStatus = state.user.onlineStatus;
         }
          if(state.user.userData && state.user.userData.provigilUserData && state.user.userData.provigilUserData.userName){
            this.userName = state.user.userData.provigilUserData.userName;
        }
    });
  }
  itemSelected(item): void {
    if (navigator.onLine) {
        this.store.dispatch(this.navActs.navigateToPage(Pages.HOME));
        this.store.dispatch(this.potentialActions.activePotentail(this.list[item]));
        //this.store.dispatch(this.userActions.potentialListActive());
    } else {
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
  presentOfflineToast() {
      let toast = this.toastCtrl.create({
          message: 'Device offline. Please check network.',
          duration: 3000,
          position: 'top'
      });
      toast.present();
  }
  dismissTutorial() {
    this.showTutorial = false;
  }
  goToTutorialStart() {
    this.slides.slideTo(0, 2000);
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopupPage);
    popover.present({
      ev: myEvent
    });
  }
}
