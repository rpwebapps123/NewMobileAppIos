
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Store } from '@ngrx/store';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { MonitorActions } from '../../actions/monitor.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { MonitoringStatusDetails, MonitoringUnitDetails, User } from '../../models/user';
import { IAppState } from '../../reducers';





@Component({
    selector: 'monitoring-page',
    templateUrl: 'monitoring.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorPage {
    public users: Observable<User>;
    private montieringdata: any;
    private userSubscription: any;
    private potentialId: string;
    private installationId: string;
    private url: string;
    //private monitorHours: MonitoringDetails;
    monitorHours:any;
    private monitorStatus: MonitoringStatusDetails;
    private monitorUnit: MonitoringUnitDetails;
    private title: string
    private monitorStatusVal: string = '-';
    private monitorUnitStatusVal: string = '-';
    private armStatus: number;    
    siteTimeZone: string;
    erroMessage = '';
    pvmUser: string;
    schedule:any;
    is24Hours:boolean;
    constructor(
        private store: Store<IAppState>,
        private navActs: NavigationActions,
        private userActions: UserActions,
        private monitorActions: MonitorActions,
        private modalCtrl: ModalController,
        private cd: ChangeDetectorRef,
        private device: Device,
    ) {
    };

    ionViewWillEnter() {
        this.pvmUser = window.localStorage.isPvmUser;
        this.userSubscription = this.store.select((state) => {
            return { monitor: state.monitor, potential: state.potential, user: state.user }
        })
            .subscribe(state => {
                this.potentialId = state.potential.activePotential.potentialId || '';
                this.installationId = state.potential.activePotential.installationId || '';
                this.url = state.potential.activePotential.url || '';
                this.siteTimeZone = state.potential.activePotential.timezone;
                this.monitorHours = state.monitor.MonitorHoursData ? this.formatMonitoringHours(state.monitor.MonitorHoursData.monitoringHours) : [];
                console.log('monitoring-hours', this.monitorHours);
                if(this.pvmUser === 'true' && state.monitor.MonitorHoursData) {
                    let data = state.monitor.MonitorHoursData.schedule;
                    this.schedule =  state.monitor.MonitorHoursData.schedule ? data[0]: [];
                } else {
                    this.schedule = [];
                }
                console.log('schedule-data', this.schedule);
                if (this.monitorHours.length === 0 ) {
                    this.erroMessage = ' No Monitoring Hours Available';
                }
                if (state.monitor && state.monitor.MonitoringStatusData) {
                    this.armStatus = state.monitor.MonitoringStatusData.status;
                  }
                if (state.potential.activePotential.surview) {
                    this.monitorStatusVal = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'Armed' : 'Disarmed ';
                } else {
                    this.monitorStatusVal = (Number(this.armStatus) === 0 || Number(this.armStatus) === 4) ? 'Armed' : 'Disarmed ';
                }
                this.monitorUnit = state.monitor.MonitoringUnitData ? state.monitor.MonitoringUnitData : {};
                if (this.monitorUnit && this.monitorUnit.Unit) {
                    this.monitorUnitStatusVal = (this.monitorUnit.Unit === 'UP') ? 'Online' : 'Offline';
                    this.cd.detectChanges();
                }
                this.title = 'Monitoring'
                this.cd.markForCheck();
                this.cd.detectChanges();
            });
            if(window.localStorage.isPvmUser === 'true') {
                this.store.dispatch(this.monitorActions.monitorHours({ action: 'mhrs', installationid: this.installationId, potentialid: this.potentialId, deviceId: this.device.uuid ? this.device.uuid : 'webBrowser', url: this.url}));
            } else {
                this.store.dispatch(this.monitorActions.monitorHours({ action: 'mhrs', installationid: this.installationId, potentialId: this.potentialId, deviceId: this.device.uuid ? this.device.uuid : 'webBrowser', url: this.url}));
            }
    }
    filterSchedule(key: string): string {
        let final_string = this.schedule[key].charAt(0).toUpperCase() +  this.schedule[key].slice(1).toLowerCase() || this.schedule[key.toLocaleLowerCase()].charAt(0).toUpperCase() +  this.schedule[key.toLocaleLowerCase()].slice(1).toLowerCase();
        this.is24Hours = (final_string === 'Yes') ? true : false;
        return final_string;
    }
    formatMonitoringHours(data):any{
        let tmpArray = [];
        let results: any = [];
        if(data){
            data.reduce((acc, element, index, sourceArray) => {
                let weekDay =  element.WeekofDay;
                if (tmpArray.indexOf(element.WeekofDay) === -1) {
                tmpArray.push(element.WeekofDay);
                let twenty4Hrs =  'No';
                this.is24Hours = true;
                let result = sourceArray.filter((ele) => {
                 if(ele.WeekofDay === element.WeekofDay){
                        let startTime = ele.MonitoringHours.split('-')[0];
                        let endTime = ele.MonitoringHours.split('-')[1];
                        if((startTime.trim() === '00:00 AM' && endTime.trim() === '23:59 PM') || (startTime.trim() === '00:00 AM' && endTime.trim() === '11:59 AM') || (startTime.trim() === '12:00 PM' && endTime.trim() === '23:59 PM')){
                            twenty4Hrs =  'Yes';
                            this.is24Hours = true;
                        }else{
                            this.is24Hours = false;
                        }
                    } 
                    return ele.WeekofDay === element.WeekofDay;
                });
                    results.push({weekDay , result, twenty4Hrs});
                    return result;
                } else {
                return acc;
                }
            }, []);
        }
          return results;
    }
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
    }
    loginHandler(event) {
        this.store.dispatch(this.navActs.navigateToDialog(Pages.PHONE));
    }
}