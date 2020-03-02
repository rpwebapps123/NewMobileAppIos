import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertController, ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';
import { VideoPopupPage } from '../videoPopup/videoPopup';

@Component({
  selector: 'eventlogdetail',
  templateUrl: 'eventLogDetail.html',
})
export class EventlogDetailPage {
  userSubscription: Subscription
  potentialId: string;
  sfAccountId: string;
  //eventlogDetail: EventLogList;
  public eventlogDetail: any;
  displayAddress: string
  recentEscalationsVideos : any;
  public installationId: string;
  pageSize: number = 10;
  pageNo: number = 0;
  isAllItemsLoaded: boolean;
  eventarray:any = []
  pageNumbersArray: Array<number> = [];
  totalVideoCount: any;
  errorMessage: string;
  pvmUser: string;
  constructor(private store: Store<IAppState>,
    private cd : ChangeDetectorRef,
    private userActions: UserActions,
    private CustomAlert: AlertController,
    public modalCtrl: ModalController) {

  }
  ionViewWillEnter() {
    this.errorMessage = '';
    this.pvmUser = window.localStorage.isPvmUser;
    this.recentEscalationsVideos = [];
    this.pageNumbersArray=[];
    this.eventarray = [];
    if(this.pvmUser === 'true') {
      this.store.dispatch(this.userActions.setEventLogVideoData({})); 
    }
    this.userSubscription = this.store.select((state) => {
      return {  navigation: state.navigation,user: state.user,potential: state.potential }
    })
      .subscribe(state => {
       
        this.installationId = state.potential.activePotential.installationId;
     
        this.eventlogDetail = JSON.parse(JSON.stringify(state.navigation.NavParams));
        if(this.pvmUser === 'true') {
            this.recentEscalationsVideos = state.user["eventLogVideoData"];
            if(this.pageNumbersArray.indexOf(state.user["eventLogVideoData"]["pageNo"]) == -1 && state.user["eventLogVideoData"]["pageNo"]){
              this.errorMessage = "";
              if(state.user["eventLogVideoData"]["pageNo"] && state.user["eventLogVideoData"]["pageNo"] == 1)
              this.eventarray = [];

              this.eventarray = this.eventarray.concat(state.user["eventLogVideoData"]["eventarray"]);
              this.pageNumbersArray.push(state.user["eventLogVideoData"]["pageNo"]);
              if(state.user["eventLogVideoData"]["pageNo"] && state.user["eventLogVideoData"]["pageNo"] == 1 && this.eventarray.length == 0){
              this.errorMessage = "No Videos";
              this.pageNo = 0;
              }
            }
        this.isAllItemsLoaded = state.user["eventLogVideoData"]["isAllItemsLoaded"];
        this.totalVideoCount = state.user["eventLogVideoData"]["totalVideosCount"];

        if(this.totalVideoCount == this.eventarray.length)
          this.isAllItemsLoaded =  true;
        }else{

        } 
        this.cd.markForCheck();
        
      }) 
 }

 ionViewDidEnter(){
   if(this.pvmUser === 'true'){
    this.loadVideos();
   }
 }
  prepareRequestData(pageNo){
    let requestData = {
      "groupid": "GRP20190731120216PM216834615833056",
      "installDate": "2019-07-31",
      "installationID": "a1Yo0000002o54XEAQ",
      "tagType": 0,
      "pageNo": 1,
      "pageSize": 10,
    }; 
    /* {
      "groupid": this.eventlogDetail.groupID,
      "installDate": this.getCurrentDate(),
      "installationID": this.installationId,
      "tagType": this.eventlogDetail.name,
      "pageNo": pageNo,
      "pageSize": this.pageSize,
    }; */
    return requestData;
  }
  
  loadVideos(){
    this.errorMessage = "";
    this.store.dispatch(this.userActions.getEventLogVideos(this.prepareRequestData(++this.pageNo)));
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
        
        this.loadVideos();
      }
    }, 500);
  }

  getCurrentDate(){
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
if(this.pvmUser === 'true'){
  return this.eventlogDetail.starttime.substring(0,10);
}else{
  return this.eventlogDetail.eventTimeStr.substring(0,10);
}
   

   //return todayDate;
  }

  playVideo(recentEscVideo){
    let url ="";
    if(this.pvmUser === 'true'){
      url = recentEscVideo.cloudfronturl;
    }else{
      url = recentEscVideo.eventlink;
    }
  let alert = this.CustomAlert.create({
    message: `<video controls controlsList="nodownload" preload="metadata"> <source src="${url}" type="video/mp4"> </video>`,
    title:  recentEscVideo.camname,
    // <span class=\"icon-cross\" (click)=\"dismissDialog()\" ></span>
    enableBackdropDismiss: false,
    cssClass: 'custum_video_alert',
    buttons: [{
      text: 'x',
      handler: () => {
          
      }
    },
      // {
      //   text: 'Cancel',
      //   cssClass: 'cancel-button',
      //   role: 'cancel',
      // }
    ]
  });
  alert.present();
}

playVideoModal(recentEscVideo) {
   let url ="";
  if(this.pvmUser === 'true'){
    url = recentEscVideo.cloudfronturl;
  }else{
    url = recentEscVideo.eventlink;
  }
  console.log(url);
  let modal = this.modalCtrl.create(VideoPopupPage, {'url': url}, { showBackdrop: true, enableBackdropDismiss: true});
  modal.onDidDismiss(data => {
      console.log(data.modal_status);
  });
  modal.present();
}

}
