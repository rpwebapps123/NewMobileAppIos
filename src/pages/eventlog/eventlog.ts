import { ChangeDetectorRef, Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Store } from '@ngrx/store';
import { AlertController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions';
import { Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { isDesktop } from '../../config/appConfig';
import { IAppState } from '../../reducers';
import { Globals } from './../../config/globals';

@Component({
  selector: 'eventlog',
  templateUrl: 'eventlog.html',
})
export class EventLogPage {
  private userSubscription: Subscription;
  service: boolean = true;
  helps: boolean = false;
  U_options: string;
  msgTxt: string;
  priority: string;
  number: number;
  emailAddress: string; 
  header: string;
  callerData: any;
  teamRole: string;
  accountName: string;
  userName: string;
  public sfAccountId: string;
  public installationId: string;
  public potentialId: string;
  private requestedBy: string;
  private isDesktopEnabled: boolean;
   recentEscalations: Array<any> = [];
  errorMessage: string = '';
  private prevPage: number;
  isAllItemsLoaded: boolean;
  pageNo: number = 1;
  pageSize: number = 10;
  pageNumbersArray: Array<number> = [];
  pvmUser : string;

  constructor(private store: Store<IAppState>,
    private userActions: UserActions,
    private CustomAlert: AlertController,
    private inAppBrowser: InAppBrowser,
    private callNumber: CallNumber,
    private cd: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private navActs: NavigationActions,
    public globals: Globals
  ) {
    this.pvmUser = window.localStorage.isPvmUser;
    this.errorMessage = "";
    this.userSubscription = store.select((state) => (state)).subscribe(state => {

      this.prevPage = state.navigation.Page;
      this.sfAccountId = state.potential.activePotential.sfaccountId;
      this.installationId = state.potential.activePotential.installationId;
      this.potentialId = state.potential.activePotential.potentialId;
      this.callerData = state.user.callManager;
      this.teamRole = (state.user.callManager && state.user.callManager.length) ? state.user.callManager[0].teamMemberRole : '';
      this.accountName = (state.user.callManager && state.user.callManager.length) ? state.user.callManager[0].name : '';
        this.userName = (state.user && state.user.userData && state.user.userData['provigilUserData']) ? state.user.userData['provigilUserData'].userName : '';
         try {
          if(this.pageNumbersArray.indexOf(state.user["eventLogData"]["pageNo"]) == -1 && state.user["eventLogData"]["pageNo"]) {
            if(state.user["eventLogData"]["pageNo"] && state.user["eventLogData"]["pageNo"] == 1)
            this.recentEscalations = [];
            if(this.pvmUser === 'true') {
              this.recentEscalations = this.recentEscalations.concat(state.user["eventLogData"]["eventLogList"]);
            } else {
              this.recentEscalations = this.recentEscalations.concat(state.user["eventLogData"]["eventLogIvigilList"]);
            }
         
            this.pageNumbersArray.push(state.user["eventLogData"]["pageNo"]);
            if(state.user["eventLogData"]["pageNo"] && state.user["eventLogData"]["pageNo"] == 1 && this.recentEscalations.length === 0) {
              this.errorMessage = "No Event Logs";
              this.pageNo = 1;
             }
          }
              this.isAllItemsLoaded = state.user["eventLogData"]["isAllItemsLoaded"];
            } catch(error) {
           console.log('error',error);
          }
    })
    this.cd.markForCheck();
    this.isDesktopEnabled = isDesktop;
  }
  ionViewCanEnter() {
    this.pageNumbersArray=[];
    let data = {
      sfaccountId: this.sfAccountId
    }
    this.errorMessage = "";
    this.store.dispatch(this.userActions.getEventLog(this.prepareRequestData(1)));

    }

    prepareRequestData(pageNo){
      var today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let dday,mmonth;
      var yyyy = today.getFullYear();
      dday = dd;
      if (dd < 10) {
        dday = '0' + dd;
      } 
      mmonth = mm;
      if (mm < 10) {
        mmonth = '0' + mm;
      } 
      let todayDate = yyyy + '-' + mmonth + '-' + dday; 
      let requestData = {};
      if (this.pvmUser === 'true') {
        requestData = {
         "installationID": this.installationId,
         "date": todayDate,
        //  "installationID": 'a1Yo0000002o54XEAQ',
          //"date": "2019-05-03",
          "pageNo": pageNo,
          "pageSize": this.pageSize
        }
      } else {
        requestData = {
         "potentialid": this.potentialId,
        //  "potentialid":"722294",
          "pageno": pageNo
        }
      }
        return requestData;
    }

    loadData(event) {
      setTimeout(() => {
      //  event.target.complete();
      event.complete();
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.isAllItemsLoaded) {
        
          event.disabled = true;
          
        }else{
          
          this.store.dispatch(this.userActions.getEventLog(this.prepareRequestData(++this.pageNo)));
        }
      }, 500);
    }
 
  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  showAlert = (message: string, title: string) => {
    let alert = this.CustomAlert.create({
      message: message,
      title: title,
      enableBackdropDismiss: false,
      cssClass: 'custum_alert',
      buttons: [{
        text: 'ok',
        handler: () => {
          // alert.dismiss();
        }
      }]
    });
    alert.present();
  }

  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }

  navigateToEventLogDetail(escalationData) {
    this.store.dispatch(this.navActs.navigateToPage(Pages.EVENT_LOG_DETAIL, false, escalationData, this.prevPage));
  }
}
