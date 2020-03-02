import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertController, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions/navigation.actions';
import { PotentialList } from '../../models';
import { IAppState } from '../../reducers';
import { StatsActions } from './../../actions/stats.actions';
import { Globals } from './../../config/globals';
import { VideoPopupPage } from '../videoPopup/videoPopup';

@Component({
  selector: 'page-statistic',
  templateUrl: 'stats.html'
})
export class StatsPage {
public statisticData = 'current';
private potentialID: string;
private activePotential: PotentialList;
private sfaccountId: string;
private userName: string = '';
private siteTime: string = '';
siteTimeZone:string;
errorMessage: string;
currentStatsList: any = {};
historyStatsList : any = {};
clipsStatsList : any;
private userSubscription: Subscription;
pvmUser: string;

constructor(public navCtrl: NavController, public navParams: NavParams, 
  private navActs: NavigationActions, private cd: ChangeDetectorRef, 
  private store: Store<IAppState>, private statsActions: StatsActions,
  private toastCtrl: ToastController, private globals: Globals, 
  private CustomAlert: AlertController, public modalCtrl: ModalController) { 

    }
  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
// clips Starts
 clipsStatistics = [
    {
      eventid: "54706881",
      title: "Intruder Observed",
      eventTime: "2017-05-06 18:45:00",
      thumbnailUrl: "http://workspace.pro-vigil.com:777/Thumbnails/49543.jpg",
      clipUrl: "https://s3.amazonaws.com/loggedactivities/Clips/95103_Police_Call_Out1494137679827Pro_Vigil_Houston_Office_houston_branch.mov"
  },
  {
    eventid: "54706881",
    title: "Intruder Observed1",
    eventTime: "2017-05-07 18:45:00",
    thumbnailUrl: "http://workspace.pro-vigil.com:777/Thumbnails/49543.jpg",
    clipUrl: "https://s3.amazonaws.com/loggedactivities/Clips/95103_Police_Call_Out1494137679827Pro_Vigil_Houston_Office_houston_branch.mov"
  },
  {
    eventid: "54706881",
    title: "Intruder Observed2",
    eventTime: "2017-05-08 18:45:00",
    thumbnailUrl: "http://workspace.pro-vigil.com:777/Thumbnails/49543.jpg",
    clipUrl: "https://s3.amazonaws.com/loggedactivities/Clips/95103_Police_Call_Out1494137679827Pro_Vigil_Houston_Office_houston_branch.mov"
  }
];
  // clips End

  // Current Starts
  currentActivites;
  currentAlarms;
  currentThefts;
  currentArrests;
  currentMissed;
  // Current End

    // History Starts
    historyActivites;
    historyAlarms;
    historyThefts;
    historyArrests;
    historyMissed;
    // History End

  ionViewDidEnter() {
    try {
      this.pvmUser = window.localStorage.isPvmUser;
        this.userSubscription = this.store.select((state) => ({ user: state.user, potential: state.potential }))
        .subscribe(state => {
    try {
            this.activePotential = state.potential.activePotential;
            this.sfaccountId = state.potential.activePotential.sfaccountId;
            this.potentialID = state.potential.activePotential.potentialId || '';
            this.siteTimeZone =  state.potential.activePotential.timezone;
            if (state.user.userData && state.user.userData.provigilUserData && state.user.userData.provigilUserData.userName) {
              this.userName = state.user.userData.provigilUserData.userName;
            }
            if (state.user && state.user.currentStatsList) {
                this.currentStatsList = state.user.currentStatsList;
                this.currentActivites = this.currentStatsList.ActivitiesSeen;
                this.currentAlarms = this.currentStatsList.Outputs; //Output for Alarms Activated
                this.currentThefts = this.currentStatsList.TheftsAverted;
                this.currentArrests = this.currentStatsList.Arrests;
                this.currentMissed = this.currentStatsList.Missed;
                this.cd.detectChanges();
            }
            if (state.user && state.user.historyStatsList) {
              this.historyStatsList = state.user.historyStatsList;
                this.historyActivites = this.historyStatsList.ActivitiesSeen;
                this.historyAlarms = this.historyStatsList.Outputs;
                this.historyThefts = this.historyStatsList.TheftsAverted;
                this.historyArrests = this.historyStatsList.Arrests;
                this.historyMissed = this.historyStatsList.Missed;
                this.cd.detectChanges();
          }
         
          if (state.user && state.user.clipsStatsList !== undefined) {
            this.clipsStatsList = (state.user.clipsStatsList) ? (state.user.clipsStatsList).filter((item) => {
                return (this.get_url_extension(item.clipUrl) !== 'mov') ? true : false;
            }) : [] ;
           // console.log('chari-test', this.clipsStatsList);
            this.cd.detectChanges();
        }
        } catch (err) {
            console.log('error' , err);
        }
        });
        this.getCurrentStats();
    } catch (err) {
      console.log('error' , err);
    }
  }
  get_url_extension( url ): string {
    return url.split(/\#|\?/)[0].split('.').pop().trim();
  }
  getCurrentStats() {
    if(navigator.onLine){
        this.errorMessage = '';
        let data = {};
        if(this.pvmUser === 'true') {
          data = {
            installationid: this.potentialID,
            requireddata: 'current'
          }
        } else {
          data = {
            action: 'STATS',
            date : new Date().getFullYear() + '-' + String(new Date().getMonth() + 1) ,
            device: this.userName,
            requestFrom:'mobileapp',
            potentialId: this.potentialID,
            from:'newmobileapp'
          }
        }
        this.store.dispatch(this.statsActions.fetchCurrentStats(data));
    }else{
        this.showToast('You are currently offline.The SEE SCHEDULE not deleted');
    }
}
getHistoryStats() {
  if(navigator.onLine){
      this.errorMessage = '';
      let data = {};
      if(this.pvmUser === 'true') {
        data = {
          installationid: this.potentialID,
          requireddata: 'history'
        }
      } else {
        data = {
          action: 'STATS',
          device: this.userName,
          requestFrom:'mobileapp',
          potentialId: this.potentialID,
          from:'newmobileapp'
        }
      }
      this.store.dispatch(this.statsActions.fetchHistoryStats(data));
  }else{
      this.showToast('You are currently offline.The SEE SCHEDULE not deleted');
  }
}
getClipsStats() {
  if(navigator.onLine){
      this.errorMessage = '';
      let data = {};
      if(this.pvmUser === 'true') {
        data = {
          installationid: this.potentialID,
          requireddata: 'clips'
        }
      } else {
        data = {
          action: 'clips',
          date : new Date().getFullYear() + '-' + String(new Date().getMonth() + 1) ,
          device: this.userName,
          requestFrom:'mobileapp',
          potentialId: this.potentialID,
          from:'newmobileapp'
        }
      }
      this.store.dispatch(this.statsActions.fetchClipsStats(data));
  }else{
      this.showToast('You are currently offline.The SEE SCHEDULE not deleted');
  }
}
loadData(){
  if (this.statisticData === 'current') {
    this.getCurrentStats();
} else if (this.statisticData === 'history') {
    this.getHistoryStats();
} else if (this.statisticData === 'clips') {
  this.getClipsStats();
}
}
playVideo(clipVideo){
  let alert = this.CustomAlert.create({
    message: "<video controls controlsList=\"nodownload\"> <source src=\""+clipVideo.clipUrl+"\" type=\"video/mov\"> </video>",
    title:  clipVideo.title,
    // <span class=\"icon-cross\" (click)=\"dismissDialog()\" ></span>
    enableBackdropDismiss: false,
    cssClass: 'custum_video_alert',
    buttons: [{
      text: 'x',
      handler: () => {
          
      }
    },
    ]
  });
  alert.present();
}
playVideoModal(clipVideo) {

 let modal = this.modalCtrl.create(VideoPopupPage, {'url': clipVideo.clipUrl}, { showBackdrop: true, enableBackdropDismiss: true});
 modal.onDidDismiss(data => {
     console.log(data.modal_status);
 });
 modal.present();
}

}
