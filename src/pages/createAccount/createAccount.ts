import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalController, NavController, ViewController } from 'ionic-angular';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { SignupDetails } from '../../models/user';
import { IAppState } from '../../reducers';




@Component({
  selector: 'create-account',
  templateUrl: 'createAccount.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAccount {
    signup: SignupDetails;
    confirmPassword: string;

    constructor(
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private store: Store<IAppState>,
        private userActions: UserActions,
        private modalCtrl: ModalController,
        private navActs: NavigationActions) {
            this.signup = new SignupDetails();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goBack() {
        this.store.dispatch(this.navActs.navigateToDialog(Pages.PHONE));
        this.dismiss();
    }

    showTAC() {
        // let tNc = Pages.TERMS_AND_CONDITIONS;
        // this.store.dispatch(this.navActs.navigateToDialog(tNc));
        // this.dismiss();
    }

    createAccount() {
        if (this.signup.password !== this.confirmPassword) {
            alert('Password and Confirm password should be same.');
            return;
        }
        // this.store.dispatch(this.userActions.createAccount(this.signup));
    }
}