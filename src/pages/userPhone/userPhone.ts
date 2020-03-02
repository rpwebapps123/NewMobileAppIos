import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalController, ViewController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { NavigationActions } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';




@Component({
  selector: 'user-phone',
  templateUrl: 'userPhone.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPhonePage {
    public user: Observable<{}>;
    public userSubscription: Subscription;
    public mobile: number;
    constructor(
        private viewCtrl: ViewController,
        private store: Store<IAppState>,
        private userActions: UserActions,
        private navigationActions: NavigationActions,
        private modalCtrl: ModalController) {
            this.user = store.select('UsersReducer');
            this.userSubscription = store.select('UsersReducer')
            .subscribe(value =>{
                this.mobile = (value || {} as any).Mobile;
            });
    }

    continue() {
        // this.store.dispatch(this.userActions.updateMobileNumber(this.mobile));
    }
    ionViewWillLeave(){
        this.userSubscription.unsubscribe();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ngOnDestroy(){
      this.userSubscription.unsubscribe();
    }
}