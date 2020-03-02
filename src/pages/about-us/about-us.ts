import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';
import { Platform } from 'ionic-angular';
import { isDesktop } from '../../config/appConfig';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  userSubscription: Subscription;
  isIos : boolean = false;
  isDesktop = isDesktop;
  constructor(
    private store: Store<IAppState>,
    private userActions: UserActions,
    private potentialActions: PotentialActions,
    public platform: Platform,
    private navActs: NavigationActions) {
  }

  dismissTutorial() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.SETTING));
  }
ionViewDidLoad(){
  this.isIos = this.platform.is('ios');
}
}
