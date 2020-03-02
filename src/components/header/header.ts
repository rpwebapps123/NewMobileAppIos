import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Events, Nav, ToastController } from 'ionic-angular';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';
import { isDesktop } from './../../config/appConfig';


// $IMPORTSTATEMENT

/**
 * Generated class for the HeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// $IONICPAGE
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderPage {
  @ViewChild(Nav) nav: Nav;
  userSubscription/*: Subscription*/
  siteName: string
  header: string
  @Input('header') Header: string
  private headerConfig: any
  showHeader: boolean;
  private showButton: boolean;
 showBack: boolean;
  private title: string;
  private showList: boolean;
  private prevPage: number;
  private previousPage: number;
  private potentialListActive: boolean;
  private cameraListActive: boolean;
  showBackButton: boolean;
 showImage: boolean;
  private showToolbarDesktop: boolean;
  private showToolbarMobile: boolean;
  private isTutorialShowing: boolean;
  private data: number;

  constructor(
    private store: Store<IAppState>,
    private potentialActions: PotentialActions,
    private userActions: UserActions,
    private navActs: NavigationActions,
    private toastCtrl: ToastController,
    private events: Events,
    private cd: ChangeDetectorRef) {
    this.showHeader = false;
    this.userSubscription = this.store.select(function (state) {
      return state;

    })
      .subscribe(state => {
        this.showButton = false;
        this.showBack = false;
        this.showList = false;
        this.showImage = false;
        this.title = 'Pro-Vigil';
        this.potentialListActive = false;
        this.cameraListActive = false;
        this.showBackButton = true;
        this.showToolbarDesktop = false;
        this.showToolbarMobile = true;

       
        if (state && state.navigation) {
          this.headerConfig = state.navigation.headerConfig;
          this.showHeader = this.headerConfig.showHeader;
          this.showButton = this.headerConfig.showButton;
          this.showBack = this.headerConfig.showBack;
          this.showList = this.headerConfig.showList;
          this.title = this.headerConfig.showTitle;
          this.prevPage = state.navigation.Page;
          this.previousPage = state.navigation.prevPage;
          this.potentialListActive = state.user.potentialListActive;
          this.cameraListActive = state.user.cameraListActive;
          this.showBackButton = this.headerConfig.showBackButton;
          this.showImage = this.headerConfig.showImage;
          this.showToolbarDesktop = this.headerConfig.showToolbarDesktop;
          this.showToolbarMobile = this.headerConfig.showToolbarMobile;
        }

        if(state && state.camera && state['camera']['HideHeader'] === true){
          this.showHeader = false;
        }

        if(state && state.camera && state['camera']['Title'] && this.title === "Home"){
          this.title = state['camera']['Title'];
        }
        

       // this.isTutorialShowing = (!state.user.hasSeenTutorial && !state.user.userData.hasPin);
       this.isTutorialShowing = (!state.user.hasSeenTutorial);
        this.siteName = state && state.potential && state.potential.activePotential ? state.potential.activePotential.siteName : '';
        this.data = state.user.notfificationCountSuccess ? state.user.notfificationCountSuccess.data : '';
        //this.cd.detectChanges();
        this.cd.markForCheck();
      })

    events.subscribe('sidearea:clicked', (user, time) => {
      if (this.potentialListActive) {
        this.potentialListActive = false;
        this.store.dispatch(this.userActions.potentialListInActive());
        this.store.dispatch(this.userActions.cameraListInActive());
      }
    });
  }



  goToPotential(event) {
    this.store.dispatch(this.userActions.potentialListActive());
    this.cd.detectChanges();
    this.store.dispatch(this.navActs.navigateToPage(Pages.POTENTIAL_LIST_MENU, false, '', this.prevPage));
  }
  showListMenu(event) {
    if (!this.cameraListActive) {
      this.store.dispatch(this.userActions.cameraListActive());
      this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA_LIST_MENU));
    } else {
      this.store.dispatch(this.userActions.cameraListInActive());
      this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
    }
    this.cd.detectChanges();
  }
  goToBack(event) {
    this.store.dispatch(this.userActions.potentialListInActive());
    console.log('previous-page', this.previousPage);
    if(this.previousPage == Pages.CAMERA){
      this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
    }else if(this.previousPage == Pages.CAMERA_LIST_MENU){
      this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA_LIST_MENU));
    }else if(this.prevPage === Pages.HOME || this.prevPage === Pages.SITES_LIST) {
    }else{
      this.store.dispatch(this.userActions.cameraListInActive());
      this.store.dispatch(this.navActs.navigateToPage(this.previousPage));
    }
  }
  goToHome(event) {
    if (navigator.onLine) {
      this.store.dispatch(this.userActions.potentialListInActive());
      this.store.dispatch(this.userActions.cameraListInActive());
      this.store.dispatch(this.navActs.navigateToPage(Pages.HOME));
    } else {
      this.showToast('You are currently offline, check after sometime.');
    }
  }
  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }
  navigateToNotifications() {
    if (navigator.onLine) {
      this.store.dispatch(this.navActs.navigateToPage(Pages.NOTIFICATION_PAGE));
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

  navigateToSettingsPage() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.SETTING));
  }
  navigateToTicketing() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.MANAGE_ALARMS));
  }

 
}
