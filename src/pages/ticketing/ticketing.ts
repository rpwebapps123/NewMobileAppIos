import { ChangeDetectorRef, Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Store } from '@ngrx/store';
import { AlertController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { UserActions } from '../../actions/user.actions';
import { AppConfig, isDesktop } from '../../config/appConfig';
import { TicketList } from '../../models/user';
import { IAppState } from '../../reducers';



@Component({
  selector: 'page-ticketing',
  templateUrl: 'ticketing.html',
})
export class TicketingPage {
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
  private requestedBy: string;
  isDesktopEnabled: boolean;
  private ticketList: Array<TicketList>;
  private filteredTicketList: Array<TicketList>;
  errorMessage: string = '';
  statusSelection: string;
  timeZone: any;
  pvmUser: string;
  closedTickets: boolean = false;
  openedTickets: boolean = false;
  isOpenTickets: boolean = false;
  constructor(private store: Store<IAppState>,
    private userActions: UserActions,
    private CustomAlert: AlertController,
    private inAppBrowser: InAppBrowser,
    private callNumber: CallNumber,
    private cd: ChangeDetectorRef,
    private toastCtrl: ToastController,
  ) {
    this.pvmUser = window.localStorage.isPvmUser;
    this.errorMessage = "";
    this.userSubscription = store.select((state) => (state)).subscribe(state => {
      this.sfAccountId = state.potential.activePotential.sfaccountId;
      this.installationId = state.potential.activePotential.installationId;
      this.callerData = state.user.callManager;
      this.teamRole = (state.user.callManager && state.user.callManager.length) ? state.user.callManager[0].teamMemberRole : '';
      this.accountName = (state.user.callManager && state.user.callManager.length) ? state.user.callManager[0].name : '';
      this.number = (state.user.callManager && state.user.callManager.length) ?
        state.user.callManager[0].phone || state.user.callManager[0].mobilePhone : '8666161318';
        if( state.user.userData && state.user.userData && this.pvmUser === 'false') {
          this.timeZone = state.user.userData.timeZone;
          this.userName = (state.user && state.user.userData) ? state.user.userData.userName : '';
        }
        if( state.user.userData && state.user.userData['provigilUserData'] && this.pvmUser === 'true') {
          this.timeZone = state.user.userData.provigilUserData.timeZone;
          this.userName = (state.user && state.user.userData && state.user.userData['provigilUserData']) ? state.user.userData['provigilUserData'].userName : '';
        }
        try{
         
          console.log('chari',  state.user.ticketsList);
            this.ticketList = state.user.ticketsList;
           if(this.ticketList && (this.ticketList.length === 0)){
            this.errorMessage = state.user.ErrorMessage;
           } 
         
             this.displayOpenTickets(true);
             this.statusSelection = "open";
       
            }catch(error){
           console.log('error',error);
          }
         
          if(state.user['isSwitchToTickets']){
            state.user['isSwitchToTickets'] = false;
          this.sevice(true);
          }
          

        if(!this.number)
        this.number = 8666161318;
    })
    this.header = 'Ticketing';
    this.cd.markForCheck();
    this.isDesktopEnabled = isDesktop;
  }
  ionViewCanEnter() {
    let data = {
      sfaccountId: this.sfAccountId
    }
    //this.store.dispatch(this.userActions.callManager(data));

    let ticketData = {
      "user_name": this.userName,
	    "source":"Mobile App"
    }
    this.errorMessage = "";
     this.store.dispatch(this.userActions.listTicket(ticketData));
  
  }

  private setViewMoreStatus(ticket){
    ticket.isviewmore = !ticket.isviewmore;
  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  ionViewDidLoad() {
    if (this.callerData.length) {
      this.number = this.callerData[0].phone
    } else {
      this.number = 8666161318
    }
    if(!this.number)
    this.number = 8666161318
 
    this.emailAddress ='test@pro-vigil.com';
    this.cd.markForCheck();
    
      this.statusSelection = "open";
        
  }
  sevice(isShow) {
    this.service = isShow
    if(isShow){ // Display Open Tickets
      let ticketData = {
        "user_name": this.userName,
        "source":"Mobile App"
      }
       this.store.dispatch(this.userActions.listTicket(ticketData));
    
   }
  }

  displayOpenTickets(isOpenTickets){
     let ticketList = JSON.parse(JSON.stringify(this.ticketList));

     this.filteredTicketList = [];
     this.isOpenTickets = isOpenTickets;
     this.closedTickets = false;
     this.openedTickets = false;
     for(let i=0;i<ticketList.length;i++){
       let ticket = ticketList[i];
       if(ticket.status === 'Closed' && !isOpenTickets) {
            this.filteredTicketList.push(ticket);
            this.closedTickets = true;
       } else  if(ticket.status !== 'Closed' && isOpenTickets) {
            this.filteredTicketList.push(ticket);
            this.openedTickets = true;
       }
     }
     this.cd.markForCheck();
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


  submit() {
    if (navigator.onLine) {
      // if (!this.U_options || !this.priority || !this.msgTxt) {
      //   this.showAlert('Please complete all information', 'Error');
      // } else if (this.U_options.trim() === '' || this.msgTxt.trim() === '') {
      //   this.showAlert(' Please complete all information', 'Error');
      // } 
      if (!this.msgTxt || this.msgTxt.trim() === '') {
         this.showAlert(' Please provide description', 'Error');
      } /* else if(this.msgTxt && this.msgTxt.length > 500){
        this.showAlert('Description cannot exceed 500 characters.', 'Error');
      } */
      else {
        // let data = {
        //   subject: this.U_options.trim(),
        //   description: this.msgTxt.trim(),
        //   priority: this.priority,
        //   requestedBy: this.userName,
        //   sfaccountId: this.sfAccountId
        // }
         let data = {
          account: this.sfAccountId,
          installation: this.installationId,
          description: this.msgTxt.trim(),
          user_name: this.userName,          
          "source":"Mobile App"
        }
//        this.store.dispatch(this.userActions.ticketing(data));
        this.store.dispatch(this.userActions.createTicket(data));
        
        this.U_options = '';
        this.msgTxt = '';
        this.priority = '';
        this.requestedBy='';
      }
    } else {
      this.showToast('You are currently offline. Please try again when online.');
    }
  }
  

  cal() {
    if (navigator.onLine) {
      if (!this.number) {
        this.number = 8666161318;
      }
      let alert = this.CustomAlert.create({
        message: this.accountName + ' ' + '-' + ' ' + this.teamRole + '<br/>' + this.number,
        title: '<span class="icon-telephone"></span>',
        enableBackdropDismiss: false,
        cssClass: 'custum_alert',
        buttons: [{
          text: 'ok',
          handler: () => {
            this.callNumber.isCallSupported()
              .then(res => {
                this.callNumber.callNumber(this.number.toString(), true);
              })
              .catch(err => console.log('No', err))
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
    } else {
      this.showToast('You are currently offline. Please try again when online.');
    }
  }


  navigateToChatLinkPage() {
    if(navigator.onLine){
    const browser = this.inAppBrowser.create(AppConfig['pvmServiceRequests'].chatBoxUrl, '_blank', 'location=yes');
    }else{
      this.showToast('You are currently offline.the chat was not work');
    }
  }
  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }
}
