import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';


/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  private userSubscription: Subscription;
  public notificationList: Array<any>;
  private prevPage: number;
  private potentialID: string;
  errorMessage: string;
  private isPageEntered: boolean = false;
  constructor(private store: Store<IAppState>,
  private userActs: UserActions,
private navActs: NavigationActions) {
  this.isPageEntered = true;
    this.userSubscription = this.store.select((state)=> ({user: state.user, navigation: state.navigation, potential: state.potential})).subscribe(state => {
      this.prevPage = state.navigation.Page;

      if(this.isPageEntered){
        state.user.notifications = null;
      }
      if(state.user.notifications && state.user.notifications.length) {
        this.notificationList = state.user.notifications;
      }else if(state.user.notifications && state.user.notifications.length == 0){
          this.errorMessage = " No Results";
      }

      this.isPageEntered = false;
      
      this.potentialID = state.potential.activePotential.potentialId || '';
    })
  }

  ionViewDidEnter() {
    this.errorMessage = "";
    this.store.dispatch(this.userActs.fetchNotification({'accountId': this.potentialID}));
  }

  convertToDateFormat(givenDate) {
    var date = new Date(givenDate);
    return date.toDateString();
  }

  navigateToBilling() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.BALANCE_DUE_PAGE, false, '', this.prevPage));
  }

  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }

}
