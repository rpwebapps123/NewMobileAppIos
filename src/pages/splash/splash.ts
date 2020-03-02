import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Store } from '@ngrx/store';
import { Platform, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions';
import { Pages } from '../../actions/navigation.actions';
import { isDesktop } from '../../config/appConfig';
import { IAppState } from '../../reducers';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class Splash {
  private userSubscription: Subscription;
    private isNavigated: boolean = false;
    private isLoggedIn:boolean=true;
  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen, private store: Store<IAppState>,
    platform: Platform,
    private navActs: NavigationActions) {

    platform.ready().then(() => {

  })

  }

  ionViewDidEnter() {
    this.splashScreen.hide();
    this.userSubscription = this.store
            .select(data => data.user)
            .subscribe(user => {
                this.isLoggedIn = user.IsLoggedin;
                if (user.IsLoggedin && !this.isNavigated) {
                    this.isNavigated = true;
                    this.store.dispatch(this.navActs.navigateToPage(Pages.HOME));
                }else{
                  this.store.dispatch(this.navActs.navigateToPage(Pages.LOGIN));
                }
                this.splashScreen.hide();
                if (this.userSubscription) {
                    this.userSubscription.unsubscribe();
                }
                return;
            })

  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
}
}