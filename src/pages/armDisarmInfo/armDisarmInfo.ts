import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';
import * as moment from 'moment-timezone';




@Component({
    selector: 'terms',
    templateUrl: 'armDisarmInfo.html'
})
export class ArmDisarmInfo {

    private userSubscription: Subscription;
    private armInfo: Array<any> = [];
    private topClassName = 'full-width';
    pvmUser: string;
    momentjs: any = moment;
    siteTimeZone: string; 
    constructor(
        private navCtrl: NavController,
        private store: Store<IAppState>,
        private userActions: UserActions,
        private navActs: NavigationActions,
        private platform: Platform,
        private elementRef:ElementRef) {
            this.pvmUser = window.localStorage.isPvmUser;
        this.userSubscription = store.select((state) => ({ user: state.user, potential: state.potential , armstatus: state.armStatus }))
            .subscribe(state => {
                this.armInfo = [];
                this.siteTimeZone =  state.potential.activePotential.timezone;
                if (state.armstatus && state.armstatus.armDisArmInfo && state.armstatus.armDisArmInfo.length > 0) {
                    this.armInfo = state.armstatus.armDisArmInfo;
                } else {
                    this.armInfo = [];
                }

             
            });

    }
    convertCtToLocalTime(date: any) :string {
        let customDate = date.year + '-' + (Number(date.month) + 1) + '-' + date.dayOfMonth;
        let customTime = '0'+date.hourOfDay + ':' + date.minute + ':' + date.second;
        let customDateTime = customDate + ' ' + customTime;
        let timezoneName = this.getTimeZoneName(this.siteTimeZone).name;
        console.log('date-time', customDateTime);
    //  const ctOffsetName = this.getTimeZoneName('CT').name;
     //  this.momentjs.tz.setDefault(ctOffsetName);
     //window.localStorage.timezone=this.siteTimeZone;
     customDateTime= customDateTime.replace(/-/g, "/"); 
     let convertedTime ="";
     if(this.siteTimeZone === 'CT') {
        convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).format('HH:mm:ss  DD-MM-YYYY');
     } else {
       // convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).add('6', 'hours').tz(timezoneName).format('HH:mm:ss  DD-MM-YYYY');
      let date1:Date=new Date(this.momentjs.utc(customDateTime));
       let hours:any =-Math.floor(date1.getTimezoneOffset()/60);
       window.localStorage.hours=hours;
       convertedTime = this.momentjs(this.momentjs.utc(customDateTime)).add(hours-1, 'hours').tz(timezoneName).format('HH:mm:ss  DD-MM-YYYY');
    //  convertedTime = this.utcToLocal(customDateTime, timezoneName);//this.momentjs(this.momentjs.utc(customDateTime)).add('6', 'hours').tz(timezoneName).format('HH:mm:ss  DD-MM-YYYY');
     }
       return convertedTime;
   }
private utcToLocal(utcdateTime, tz) {
    var zone = moment.tz(tz).format("Z") // Actual zone value e:g +5:30
    alert(zone);
    var zoneValue = zone.replace(/[^0-9: ]/g, "") // Zone value without + - chars
    var operator = zone && zone.split("") && zone.split("")[0] === "-" ? "-" : "+" // operator for addition subtraction
    var localDateTime
    var hours = zoneValue.split(":")[0]
    var minutes = zoneValue.split(":")[1]
 //   alert(hours);
    if (operator === "-") {
        localDateTime = moment(utcdateTime).subtract(hours, "hours").subtract(minutes, "minutes").format('HH:mm:ss  DD-MM-YYYY')
    } else if (operator) {
        localDateTime = moment(utcdateTime).add(hours, "hours").add(minutes, "minutes").format('HH:mm:ss  DD-MM-YYYY')
    } else {
        localDateTime = "Invalid Timezone Operator"
    }
    return localDateTime
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
    ionViewWillEnter() {
     
    }
    ionViewDidLoad(){
          if(this.platform.is('ios'))
          {
            this.topClassName = 'full-width-ios-arminfo';
          }else{
            this.topClassName = 'full-width';
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


}