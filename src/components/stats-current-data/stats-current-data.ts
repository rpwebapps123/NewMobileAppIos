
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Store } from '@ngrx/store';
import { AlertController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { EventListAction } from '../../actions/eventList.action';
import { EventsActions } from '../../actions/events.action';
import { VideoActions } from '../../actions/video.action';
import { User } from '../../models/user';
import { IAppState } from '../../reducers';
import { NavigationActions, Pages } from './../../actions/navigation.actions';





@Component({
  selector: 'stats-current-data',
  templateUrl: 'stats-current-data.html'
})
export class StatsCurrentDataComponent {

  public users: Observable<User>;
  private selectedFromDate: any;
  @Input('fromDate') fromDate: any;
  @Input('toDate') toDate: any;
  private siteStats: any;
  private theftsAverted: string;
  private eventsReviewed: string;
  private moreEvents: string;
  private moreEventsCount: string;
  private prevPage: number;
  private userSubscription: Subscription;
  private potentialID: string;
  constructor(
    private store: Store<IAppState>,
    private navActs: NavigationActions,
    private eventActions: EventsActions,
    private eventListActions: EventListAction,
    private device: Device,
    private customAlert: AlertController,
    private cd: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private videoActions: VideoActions) {
    this.userSubscription = this.store.select((state) => ({ stats: state.events, potential: state.potential, navigation: state.navigation })).subscribe(eventData => {
      this.siteStats = eventData.stats.siteStats.SiteStatistics || {};
      this.moreEvents = (eventData.stats.allEvents && eventData.stats.allEvents.length) ? '1' : '0';
      if (eventData.stats.siteStats && eventData.stats.siteStats.SiteStatistics) {
        setTimeout(() => {
          this.theftsAverted = this.siteStats.TheftsAverted ? this.siteStats.TheftsAverted : '0';
          this.eventsReviewed = this.siteStats.ActivitiesSeen ? this.siteStats.ActivitiesSeen : '0';
          this.moreEventsCount = this.siteStats.Events ? this.siteStats.Events.length : '0';
          this.cd.markForCheck();
        }, 0);
      }
      this.potentialID = eventData.potential.activePotential.potentialId
      this.prevPage = eventData.navigation.Page;
    })
  }

  ngOnInit() {
    this.getDate();
    setTimeout(() => {
      this.cd.markForCheck();
    }, 100)
  }
  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }

  ngDoCheck() {
    if (this.fromDate) {
      this.fromDate = this.fromDate;
    }
    // this.fromDate = new Date().toISOString();
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

  getDate() {
    if (navigator.onLine) {
    var fromDate = new Date(this.fromDate);
    var toDate = new Date(this.toDate);
    if (fromDate.getTime() > toDate.getTime()) {
      this.showAlert('"Start date" should be less than "End date"', 'Error');
    } else if (toDate.getTime() > new Date().getTime()) {
      this.showAlert('You cannot select future dates', 'Error');
    } else {
      this.store.dispatch(this.eventActions.fetchSiteStats({
        action: 'STATS',
        requestFrom:'mobileapp',
        potentialId: this.potentialID,
        device: this.device.uuid ? this.device.uuid : 'webBrowser',
        date: String(new Date(toDate).getUTCFullYear()) + '-' + String((new Date(toDate).getMonth()) + 1)
      }));
      this.store.dispatch(this.eventActions.saveDate(toDate));
      this.store.dispatch(this.videoActions.getvideos({
        action: 'mobileclips',
        potentialId: this.potentialID,
        date: String(new Date(toDate).getUTCFullYear()) + '-' + String((new Date(toDate).getMonth()) + 1),
        deviceId: this.device.uuid ? this.device.uuid : 'webBrowser'
      }
      ));
    }
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
  showEventList() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.EVENT_LIST, false, '', this.prevPage));
  }

}
