import { ChangeDetectorRef, Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Store } from '@ngrx/store';
import { AlertController, ModalController, NavController, ToastController } from 'ionic-angular';
import * as moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { PotentialList } from '../../models';
import { IAppState } from '../../reducers';
import { Globals } from './../../config/globals';


@Component({
    selector: 'alarms',
    templateUrl: 'alarms.html',
})
export class Alarms {
    public armData = 'DisArmSite'
    title: string
    private name: string;
    private msgTxt: string = '';
    private untilTime: string = '';
    private userSubscription: Subscription;
    private armCamera: boolean;
    private armCameraColor: string;
    private potentialID: string;
    private activePotential: PotentialList;
    private siteName: string;
    private fromDate: any = new Date().toISOString();
    private fromDisplayDate: any = new Date().toTimeString().slice(0, 8);
    private fromDateNew: any = new Date().toISOString();
    private toDateNew: any = new Date().toISOString();
    private toDate: any;
    private toDisplayDate: any = new Date().toTimeString().slice(0, 8);
    private noneActive: boolean = true;
    private dailyActive: boolean;
    private weeklyActive: boolean;
    private monthlyActive: boolean;
    private sfaccountId: string;
    private recurrenceDayOfWeekMask: number;
    private sunday: boolean = false;
    private monday: boolean = false;
    private tuesday: boolean = false;
    private wednesday: boolean = false;
    private thursday: boolean = false;
    private friday: boolean = false;
    private saturday: boolean = false;
    private fromTime: any = new Date().toISOString();
    private fromDisplaytime: any = new Date().toLocaleDateString('en-GB');
    private toDisplaytime: any = new Date().toLocaleDateString('en-GB');
    private toTime: any = new Date().toISOString();
    private recurs: string = 'none';
    private alarmsList: any = {};
    private pastDate: any = {};
    private maxDate: string;
    private minDate: string;
    private minimumTime: string;
    private isValidation: boolean = false;
    private minStartTime: string;
    private billingApiSent: boolean = false;
    private siteTimeZone:string;
    private isDelete: boolean = true;
    public userName: string = '';
    public siteTime: string = '';
    public timeZone: string = '';
    isTimeZoneSet: boolean;
    isProcessing: boolean;
    isPSAProcessing: boolean;
    loggerObject: any = [];
    errorMessage: string;
    filterEndMinDate:string;
    filterFromDate:string;
    filterEndDate:string;
    momentjs: any = moment;
    minYears: number;
    minDateForFilter: number;
    remainingCharacters: number = 230;
    timezoneName: string;
    createEndMaxDate: string;
    constructor(
        private navCtrl: NavController,
        private store: Store<IAppState>,
        private userActions: UserActions,
        private modalCtrl: ModalController,
        private device: Device,
        private customAlert: AlertController,
        private navActs: NavigationActions,
        private toastCtrl: ToastController,
        private cd: ChangeDetectorRef,
        private globals: Globals) {
        /**comment by apresh
        this.pastDate = this.convertDateStringToLocal(new Date().toLocaleDateString('en-GB'), new Date().toISOString());
        **/
        // this.noneActive = true;
        this.minimumTime = '00:00:00';
    
    }

    ionViewDidEnter() {

        try {
            let date =  ((new Date()).setDate((new Date()).getDate()));
            this.isTimeZoneSet = false;
            this.isProcessing = false;
            this.isPSAProcessing = false;
            this.billingApiSent = false;
            this.userSubscription = this.store.select((state) => ({ user: state.user, potential: state.potential, armstatus: state.armStatus }))
              .subscribe(state => {
           try {
                 //subtracting 7 days
                  this.fromTime = new Date(date).toISOString();
                  this.toTime = new Date(date).toISOString();
                  this.title = 'Manage Alarms';
                  this.armCamera = state.user.armCamera;
                  this.activePotential = state.potential.activePotential;
                  this.siteName = state.potential.activePotential.siteName;
                  this.sfaccountId = state.potential.activePotential.sfaccountId;
                  this.potentialID = state.potential.activePotential.potentialId || '';
                  this.siteTimeZone =  state.potential.activePotential.timezone;
                  if (state.user && state.user.alarmList) {
                      this.alarmsList = state.user.alarmList;
                      this.cd.detectChanges();
                  } else{
                      this.alarmsList  = [];
                      this.errorMessage = 'No scheduled PSA.';
                  }
                   if (state.user.alarmList && state.user.alarmList.length === 0 && !this.isPSAProcessing) {
                      this.isPSAProcessing = true;
                      this.errorMessage = "No scheduled PSA.";
                  }
                  if (this.sfaccountId && !this.billingApiSent) {
                      this.billingApiSent = true;
                      // this.store.dispatch(this.userActions.balanceDue({
                      //     sfAccountId: this.activePotential.sfaccountId
                      // }));
                  }
                  this.timezoneName = this.getTimeZoneName(this.siteTimeZone).name;
                  //this.minYears = this.momentjs().tz(this.timezoneName).add('13', 'days').format('YYYY-MM-DD');
                  //console.log('test years', this.minYears);
                  this.cd.detectChanges();
                  //this.loggerObject.push({"msgId":"LOG-INSUB-8","logType":"Info","message":"Before balanceDue.Time_Zone__c"});
                /* commented by chari  
                 if(state.user.balanceDue && state.user.balanceDue.Time_Zone__c){
                      this.siteTimeZone =  state.user.balanceDue.Time_Zone__c;
                  } */
              }catch(err){
                  console.log("error",err);
                //  this.loggerObject.push({"msgId":"LOG-INSUB-9","logType":"Error","message":"catch err"+err.toString});
              }
                  if(state.user) {
                      try{
                      this.userName = (window.localStorage.isPvmUser=='true') ? (state.user.userData.provigilUserData) ? state.user.userData.provigilUserData.userName :' ' : state.user.userData.userName;
                      //this.siteTime = state.user.siteTime;
                      this.siteTime = (window.localStorage.siteTime).replace(' ','T');
                      } catch(error) {
                          console.log("error",error);
                      }
                   // this.timeZone = state.user.userData.provigilUserData.timeZone; //comment by chari
                    this.timeZone = state.potential.activePotential.timezone;
                      try {
                        console.log('siteTime', this.siteTime);
                        if(this.siteTime) {
                            let siteTimeLess2Hrs = this.momentjs(this.momentjs.utc(this.siteTime)).add('2', 'hours').format('YYYY-MM-DDTHH:mm:ss');
                            this.siteTime = siteTimeLess2Hrs; //lessing the 2 hours form the server time
                            this.isTimeZoneSet = true;
                            this.pastDate = this.siteTime+'Z';
                            this.minDate = this.siteTime+'Z';
                            this.createEndMaxDate  = this.momentjs(this.momentjs.utc(this.siteTime)).tz(this.timezoneName).add('14', 'days').format('YYYY-MM-DD');
                            this.fromDate =  this.siteTime+'Z';
                            this.toDate =  this.siteTime+'Z';
                            this.minStartTime = this.siteTime.substring(11, 19);
                            this.minimumTime =this.siteTime.substring(11, 19);
                            this.fromDisplaytime =  this.siteTime.substring(11, 19);
                            this.toDisplaytime =  this.siteTime.substring(11, 19);
                        }
                  } catch(error) {
                      //this.loggerObject.push({"msgId":"LOG-INSUB-17","logType":"Error","message":"error"+error});
                  }
                  }
              });
          }catch(err){
             // this.loggerObject.push({"msgId":"LOG-5","logType":"Error","message":"ionViewDidEnter  - err"+err.toString});
          } finally{
              /* setTimeout(()=>{    //<<<---    using ()=> syntax
                      this.store.dispatch(this.userActions.saveLogsToServer({
                         "deviceId": this.getDeviceDetails(),
                         "data" : this.loggerObject
                      }));  
                  }, 5000); commented by chari */
              }
    this.updateItem('none');

    this.momentjs.tz.setDefault(this.timezoneName);
    let todayDate = this.momentjs().tz(this.timezoneName).format('YYYY-MM-DDTHH:mm:ss');
    this.minYears = Number(this.momentjs().tz(this.timezoneName).format('YYYY')) + 10;

    this.minDateForFilter =  this.momentjs(this.momentjs.utc()).tz(this.timezoneName).format('YYYY-MM-DD');
    console.log('timezone-set',  this.minDateForFilter);
   // let todayDate = new Date().toISOString();
    this.filterFromDate = todayDate;
    this.filterEndDate = todayDate;
    this.seeSchedule();
    }
    checkPSA(){
        if(this.armData === 'Armsite'){
            this.showAlert('You can create a PSA 2 hours from the current time.', 'Alert');
        }
    }
    filterStartDateChanged() {
        this.filterEndDate = this.filterFromDate;
        this.seeSchedule();
    }
    filterEndDateChanged(){
        this.seeSchedule();
    }
    getDeviceDetails(){
        var model = this.device.model;
        var deviceID = this.device.uuid;
        var string = this.device.version; 

        return `${model}-${deviceID}-${string}-${this.siteName}`
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
    private getOffset(offsetString: string) {
        // offsetString = offsetString.replace('–','-');
        const offsetHours = Number(offsetString.split(':')[0]);
        const offsetMins = Number(offsetString.split(':')[1]);
        let totalMinsString = ((offsetHours * 60) + offsetMins).toString();
        if (totalMinsString.indexOf('-') !== -1) {
            if (totalMinsString.length === 4) {
                totalMinsString = '-' + '0' + totalMinsString.replace('-', '')
            }
        } else {
            if (totalMinsString.length === 3) {
                totalMinsString = '+' + '0' + totalMinsString;
            } else {
                totalMinsString = '+' + totalMinsString;
            }
        }
        return totalMinsString;
    }
    countCharacters(){
        if(this.msgTxt.length > 230){
            return false;
        }
        this.remainingCharacters = 230-this.msgTxt.length;
    }
    private setViewMoreStatus(list){
        list.isviewmore = !list.isviewmore;
      }
    armSite() {

        if (!this.activePotential.surview) {
            let armDisarmData =
                {
                    action: 'ACTIVATE',
                    potentialId: this.activePotential.potentialId,
                    deviceId: this.device.uuid ? this.device.uuid : 'webBrowser',
                    sitename: this.activePotential.siteName
                }

         //   this.store.dispatch(this.userActions.userArmCamera(armDisarmData));
        } else {
            this.store.dispatch(this.userActions.surviewArmCamera({
                groupid: this.activePotential.groupid,
                auth: '5B4B617FE68D9F24E8EAB55CA892EA863840E2D149C4028864D8119200853B8192867F02433698704A7B4D6B56E40226'
            }));
        }
        if (this.activePotential.surview) {
            this.store.dispatch(this.userActions.getSurviewArmState({
                url: this.activePotential.url + 'CameraService',
                potentialId: this.activePotential.potentialId,
                event: 'MonitoringStatus'
            }));
        } else {
            this.store.dispatch(this.userActions.getArmState({
                url: this.activePotential.url + 'CameraService',
                potentialId: this.activePotential.potentialId,
                event: 'MonitoringStatus'
            }));
        }
    }

    seeSchedule(fromView:boolean = false) {
        if(navigator.onLine){
            this.isPSAProcessing = false;
            this.errorMessage = "";
            let data = {
                accountid: this.sfaccountId,
                FromDate: this.filterFromDate.split('T')[0],
                ToDate :this.filterEndDate.split('T')[0]
            }
            if(fromView){
                this.momentjs.tz.setDefault(this.timezoneName);
                let todayDate = this.momentjs().tz(this.timezoneName).format('YYYY-MM-DDTHH:mm:ss');
                this.filterFromDate = todayDate;
                this.filterEndDate = todayDate;
            }
            window.localStorage.isHomePage = 'false';
            this.store.dispatch(this.userActions.getAlarmToken(data));
            this.cd.detectChanges();
        } else {
            this.showToast('You are currently offline. Please try again when online.');
        }
    }

    getFromDate() {
        // this.fromDate = this.convertDateStringToLocal(this.fromDisplayDate, this.fromDate)
        let date =  ((new Date()).setDate((new Date()).getDate()));
        //-1

        this.toDate = this.fromDate;
            if (this.fromDate.split('T')[0] === this.siteTime.split('T')[0]) {
                this.minStartTime = this.siteTime.substring(11, 19);
                this.minimumTime =this.siteTime.substring(11, 19);
                this.fromDisplaytime = this.siteTime.substring(11, 19);
                this.toDisplaytime = this.siteTime.substring(11, 19);
            } else {

                this.minStartTime = "00:00:00";
                this.fromDisplaytime = "00:00:00"
                this.toDisplaytime = "00:00:00";
                this.minimumTime = "00:00:00";    
            }

        this.minDate = this.noneActive ? new Date(Date.parse(this.fromDate)).toISOString().slice(0, 10) : new Date((Date.parse(this.fromDate)) + (1 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
        this.maxDate = this.noneActive ? new Date((Date.parse(this.fromDate)) + (1 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10) : new Date((Date.parse(this.fromDate)) + (60 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
        this.createEndMaxDate  = this.momentjs(this.momentjs.utc(this.fromDate)).tz(this.timezoneName).add('14', 'days').format('YYYY-MM-DD');
    }

    getToDate(date){

        if (this.toDate.split('T')[0] === this.siteTime.split('T')[0]) {
            this.minimumTime =this.siteTime.substring(11, 19);
            this.toDisplaytime = this.siteTime.substring(11, 19);
        } else {
            this.minimumTime = "00:00:00";        
            this.toDisplaytime = "00:00:00";  
        }
        /* Updating the */
        var fromDate = new Date(this.fromDate);
        var toDate = new Date(this.toDate);
        let daysDiff = this.momentjs(toDate).diff(moment(fromDate), 'days');
        if(daysDiff  > 14){
            this.toDate = this.momentjs(this.momentjs.utc(fromDate)).add('13', 'days').format('YYYY-MM-DDTHH:mm:ss');
        }

    }

    convertDateStringToLocal(displaytime, time) {
        let presentTime = displaytime;
        let isoTimeStringArray = time.split('T');
        let dateValueArray = presentTime.split('/');
        isoTimeStringArray[0] =  dateValueArray.reverse().join('-');
        // isoTimeStringArray[1] = timeValueArray.join('.');
        let date = isoTimeStringArray.join('T');
        return date;
    }

    getFromTime() {
        // this.fromTime = this.convertTimeStringToLocal(this.fromDisplaytime, this.fromTime);
        // this.toTime = this.convertTimeStringToLocal(this.toDisplaytime, this.toTime);
        // this.minimumTime = !this.noneActive ? new Date((this.fromTime).toString()).toISOString().slice(11, 19) : '00:00:00';

        if(this.minStartTime > this.fromDisplaytime){
            this.fromDisplaytime = this.minStartTime;
        }
    }

    getToTime() {
        // this.fromTime = this.convertTimeStringToLocal(this.fromDisplaytime, this.fromTime);
        // this.toTime = this.convertTimeStringToLocal(this.toDisplaytime, this.toTime);

        if(this.minimumTime > this.toDisplaytime){
            this.toDisplaytime = this.minimumTime;
        }
    }

    convertTimeStringToLocal(displaytime, time) {
        let presentTime = displaytime;
        let isoTimeStringArray = time.split('T');
        let timeValueArray = isoTimeStringArray[1].split('.');
        timeValueArray[0] =  presentTime;
        isoTimeStringArray[1] = timeValueArray.join('.');
        time = isoTimeStringArray.join('T');
        return time;
    }
    private convertToDateFormat(givenDate: string): string {
        if (givenDate) {
             let formattedDate = ''
            let formattedTime;
            let  convertedTime = '';
            try {
          /*   let date = givenDate.split('T')[0];
            let time = (givenDate.split('T')[1]).split('.')[0];
            formattedDate = date.split('-')[2];
            let monthData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            formattedTime = time.split(':')[0] + ':' + time.split(':')[1]
            formattedDate +=  ' ' + monthData[parseInt(date.split('-')[1])-1]; */


          //  convertedTime = this.momentjs(givenDate.replace('.0000', '')).tz(offsetName).format('DD MMM  HH:mm');
            convertedTime =  this.convertCtToLocal(givenDate);
            //console.log('chari-converted', convertedTime + '---' + (givenDate.split('.000')[0]).replace('T', ' '));
            } catch(execption) {
                    console.log('execption', execption);
            }
           // return formattedDate + ' ' + formattedTime;
           return convertedTime;
        }
    }
    private convertUtcToLocal(date: string) {
         let splitString = date.split('T');
         let customDate = splitString[0];
         let customTime = splitString[1].split('.')[0];
         let customDateTime = customDate + 'T' + customTime;
       const offsetName = this.getTimeZoneName(this.siteTimeZone).name;
        this.momentjs.tz.setDefault(offsetName);
       let convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).tz(offsetName).format('DD MMM  HH:mm');
        return convertedTime;
    }
    private convertCtToLocal(date: string) {
        let splitString = date.split('T');
        let customDate = splitString[0];
        let customTime = splitString[1].split('.')[0];
        let customDateTime = customDate + 'T' + customTime;
    //  const ctOffsetName = this.getTimeZoneName('CT').name;
     //  this.momentjs.tz.setDefault(ctOffsetName);
     let ctOffset =  (window.localStorage.ctTime).replace(':00','');
     ctOffset = Math.abs(Number(ctOffset));
      let convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).subtract(ctOffset, 'hours').format('DD MMM  HH:mm');
       return convertedTime;
   }
    private getMomentOffset(tzone: string): string {

        let fullDate = (window as any).moment.tz(tzone).format();
        let offsetStr = '';
        if (fullDate.includes('+')) {
            offsetStr = fullDate.substring(fullDate.lastIndexOf('+'), fullDate.length);
        } else {
            offsetStr = fullDate.substring(fullDate.lastIndexOf('-'), fullDate.length);
        }
        return offsetStr;

    }

    deleteAlarm(eventId) {
        if (this.isDelete) {
            this.isDelete = false;
            if (navigator.onLine) {
                let data = {
                    accountid: this.sfaccountId,
                    eventid: eventId,
                    FromDate: this.filterFromDate.split('T')[0],
                    ToDate :this.filterEndDate.split('T')[0]
                }
                this.store.dispatch(this.userActions.deleteAlarm(data));
                setTimeout(() => {
                    this.isDelete = true;
                }, 1000);
            } else {
                this.showToast('You are currently offline. Please try again when online.');
            }
        }
    }


    updateItem(item: any) {
        if (item === 'none') {
            this.noneActive = true;
            this.dailyActive = false;
            this.weeklyActive = false;
            this.monthlyActive = false;
      //      this.minDate = new Date(Date.parse(this.fromDate)).toISOString().slice(0, 10);
      //      this.maxDate = new Date((Date.parse(this.fromDate)) + (1 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
      //      this.minimumTime = '00:00:00';
      //      this.minStartTime = new Date().toTimeString().slice(0, 8);
      
            // this.fromDate = new Date().toISOString();
            // this.toDate = new Date().toISOString();
            // this.fromTime = new Date().toISOString();
            // this.toTime = new Date().toISOString();
            this.recurs = 'none';
        } else if (item === 'daily') {
            this.noneActive = false;
            this.dailyActive = true;
            this.weeklyActive = false;
            this.monthlyActive = false;
            this.minDate = new Date((Date.parse(this.fromDate)) + (1 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
            this.maxDate = new Date((Date.parse(this.fromDate)) + (60 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
            this.minimumTime = new Date((this.fromTime).toString()).toISOString().slice(11, 19);
            this.toDate = new Date((new Date().getTime()) + (1 * 24 * 60 * 60 * 1000)).toISOString();
            this.minStartTime = '00:00:00';
            // this.toDate = new Date().toISOString();
            // this.fromTime = new Date().toISOString();
            // this.toTime = new Date().toISOString();
            this.recurs = 'daily';
        } else if (item === 'weekly') {
            this.noneActive = false;
            this.dailyActive = false;
            this.weeklyActive = true;
            this.monthlyActive = false;
            this.minDate = new Date((Date.parse(this.fromDate)) + (1 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
            this.maxDate = new Date((Date.parse(this.fromDate)) + (60 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
            this.minimumTime = new Date((this.fromTime).toString()).toISOString().slice(11, 19);
            this.toDate = new Date((new Date().getTime()) + (1 * 24 * 60 * 60 * 1000)).toISOString();
            this.minStartTime = '00:00:00';
            // this.toDate = new Date().toISOString();
            // this.fromDate = new Date((new Date().getTime()) - (5 * 24 * 60 * 60 * 1000)).toISOString(); //subtracting 7 days
            // this.fromTime = new Date().toISOString();
            // this.toTime = new Date().toISOString();
            this.recurs = 'weekly';
        } else if (item === 'monthly') {
            this.noneActive = false;
            this.dailyActive = false;
            this.weeklyActive = false;
            this.monthlyActive = true;
            this.toDate = new Date().toISOString();
            this.fromDate = new Date((new Date().getTime()) - (30 * 24 * 60 * 60 * 1000)).toISOString(); //subtracting 7 days
        } else {
            this.noneActive = false;
            this.dailyActive = false;
            this.weeklyActive = false;
            this.monthlyActive = false;
            // this.fromDate = ''
            // this.toDate = ''
            // this.fromTime = '';
            // this.toTime = '';
            this.recurs = 'none';
        }
    }

    getWeek() {
        this.recurrenceDayOfWeekMask = 0;
        if (this.sunday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 1;
        }
        if (this.monday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 2;
        }
        if (this.tuesday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 4;
        }
        if (this.wednesday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 8;
        }
        if (this.thursday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 16;
        }
        if (this.friday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 32;
        }
        if (this.saturday) {
            this.recurrenceDayOfWeekMask = this.recurrenceDayOfWeekMask | 64;
        }
        return this.recurrenceDayOfWeekMask;
    }

    private validationOfDates() {
        this.getWeek();
        this.isValidation = false;
        var totalSelectedDate = (Date.parse(this.toTime) - Date.parse(this.fromTime));
        var fromDate = new Date(this.fromDate);
        var toDate = new Date(this.toDate);
        var fromTime = new Date(this.fromTime);
        var toTime = new Date(this.toTime);
        /* if (!this.name || this.name.trim() === '') {
            this.showAlert('please enter a valid name', 'Error');
        } else */ if (!this.fromDate || !this.toDate) {
            this.showAlert('please select a valid from and to date', 'Error');
        } else if (this.noneActive && fromDate.getTime() === toDate.getTime() && fromTime.getTime() > toTime.getTime()) {
            this.showAlert('"Start Time" should be less than "End Time"', 'Error');
        // } else if (fromDate.getTime() > toDate.getTime()) {
        //     this.showAlert('"Start date" should be less than "End date"', 'Error');
        } else if (!this.msgTxt || this.msgTxt.trim() === '') {
            this.showAlert('please enter description', 'Error');
        } else if (this.noneActive) {
            let totalStartDate = this.fromDate.split('T')[0] + 'T' + this.fromTime.split('T')[1];
            let totalEndDate = this.toDate.split('T')[0] + 'T' + this.toTime.split('T')[1];
            if ((Date.parse(this.toDate) === Date.parse(this.fromDate)) && totalSelectedDate > 43200000) {
                this.showAlert('Your selected time hours are beyond 12hrs, please check', 'Validation');
            } else if ((Date.parse(totalEndDate) - Date.parse(totalStartDate)) > 43200000) {
                this.showAlert('Your selected time hours are beyond 12hrs, please check', 'Validation');
            } else {
                this.isValidation = true;
            }
        } else if (this.dailyActive) {
            if (totalSelectedDate > 43200000) {
                this.showAlert('Your selected time hours are beyond 12hrs, please check', 'Validation');
            } else {
                this.isValidation = true;
            }
        } else if (this.weeklyActive) {
            if ((totalSelectedDate > 43200000)) {
                this.showAlert('Your selected time hours are beyond 12hrs, please check', 'Validation');
            } else if (this.recurrenceDayOfWeekMask === 0) {
                this.showAlert('Please select atleast one day in a week', 'Validation');
            }
            else {
                this.isValidation = true;
            }
        }
    }

    disarmSite() {
        if (navigator.onLine) {
        var fromDate = new Date(this.fromDate);
        var toDate = new Date(this.toDate);
        var fromTime = new Date(this.fromDisplaytime);
        var toTime = new Date(this.toDisplaytime);

        /* checking  the validation date more then 14 days starts here */
        let daysDiff = this.momentjs(toDate).diff(moment(fromDate), 'days');
        /* checking the validation date more then 14 days ends here  */

       if (!this.msgTxt || this.msgTxt.trim() === '') {
            this.showAlert('please enter the description', 'Error');
        } else if (!this.fromDate || !this.toDate) {
            this.showAlert('please select a valid from and to date', 'Error');
        } else if ( (fromDate.getFullYear() >= toDate.getFullYear()) && (fromDate.getMonth() >= toDate.getMonth()) &&  (fromDate.getDate() >= toDate.getDate()) && this.fromDisplaytime >= this.toDisplaytime) {
            this.showAlert('"Start Time" should be less than "End Time"', 'Error');
        }  else if (daysDiff > 14) {
            this.showAlert('Please create PSA less then 14 days', 'Alert');
        } else {
            const startDate = this.fromDate.split('T')[0];
            const endDate = this.toDate.split('T')[0];
            const startTime =  this.fromTime;
            const endTime = this.toTime;
                //let localstartDateTime = startDate + 'T' + this.fromDisplaytime;
                //let localendDateTime = endDate + 'T' + this.toDisplaytime;
                let localstartDateTime = startDate + 'T' + this.fromDisplaytime;
                let localendDateTime = endDate + 'T' + this.toDisplaytime;
                let timeZoneName = this.getTimeZoneName(this.siteTimeZone).name;
                let offset = this.getTimeZoneName(this.siteTimeZone).offset;
                //for filter 
                this.filterFromDate = startDate;
                this.filterEndDate = endDate;
                let ctOffset = window.localStorage.ctTime;
            let disarmSite = {
               // startDateTime: this.momentjs(localstartDateTime).tz(timeZoneName).format('YYYY-MM-DDTHH:mm:ss') + '-06:00',
               // endDateTime:  this.momentjs(localendDateTime).tz(timeZoneName).format('YYYY-MM-DDTHH:mm:ss') + '-06:00',
                startDateTime: this.momentjs(localstartDateTime).tz(timeZoneName).format('YYYY-MM-DDTHH:mm:ss') + ctOffset,
                endDateTime:  this.momentjs(localendDateTime).tz(timeZoneName).format('YYYY-MM-DDTHH:mm:ss') + ctOffset,
                subject: this.msgTxt,
                psaRequestedBy: this.userName,
                accountid: this.sfaccountId,
                source: this.globals.source,
                onDemandMonitoring: 'false'
            }
            this.store.dispatch(this.userActions.planDisarm(disarmSite));
            this.resetNgModel();
            this.seeSchedule();
            this.armData = 'DisArmSite';
        } 
    }else{
    this.showToast('You are currently offline. Please try again when online.');
    }

    }

    resetNgModel() {
        let date =  ((new Date()).setDate((new Date()).getDate()));
        //-1


        // this.fromDate = this.convertDateStringToLocal(new Date(date).toLocaleDateString('en-GB'), new Date(date).toISOString());
        // this.fromDisplayDate = new Date(date).toLocaleDateString('en-GB');
        // this.toDisplayDate = new Date(date).toLocaleDateString('en-GB');
        // this.toDate = this.convertDateStringToLocal(new Date(date).toLocaleDateString('en-GB'), new Date(date).toISOString());

        this.fromDate = new Date(this.siteTime).toDateString();
        this.fromDisplayDate = new Date(this.siteTime).toDateString();
        this.toDisplayDate = new Date(this.siteTime).toDateString();
        this.toDate = new Date(this.siteTime).toDateString();
        //this.fromTime = new Date(date).toISOString();
        // this.fromDisplaytime = new Date(date).toTimeString().slice(0, 8);
        // this.toDisplaytime = new Date(date).toTimeString().slice(0, 8);
        this.fromTime = this.siteTime.substring(11, 19);
        this.fromDisplaytime =  this.siteTime.substring(11, 19);
        this.toDisplaytime =  this.siteTime.substring(11, 19);
        this.toTime = new Date(date).toISOString();
        this.name = '';
        this.msgTxt = '';
        this.sunday = false;
        this.monday = false;
        this.tuesday = false;
        this.wednesday = false;
        this.thursday = false;
        this.friday = false;
        this.saturday = false;
    }
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }

    showAlert(message, title) {
        let alert = this.customAlert.create({
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
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
      }
}