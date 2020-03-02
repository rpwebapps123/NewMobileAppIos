import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { UserActions } from '../../actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { IAppState } from '../../reducers';




@Component({
  selector: 'page-setup-pin',
  templateUrl: 'setup-pin.html',
})
export class SetupPinPage {
  pinData = {
    pin: '',
    verifyPin: '',
    email: '',
    userName: ''
  };
  private userSubscription: Subscription;
  
  constructor(
    private navCtrl: NavController,
    private navActs: NavigationActions,
    private store: Store<IAppState>,
    private userAction: UserActions,
    private CustomAlert: AlertController,
  ) {

  }

  ionViewWillEnter() {
    this.userSubscription = this.store
        .select(data => data.user)
        .subscribe(user => {
          this.pinData.userName = user.userData.provigilUserData.userName;
        })
}

  navigateToCameraPage(event) {
    this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
  }
  showAlert = (message: string, title: string) => {
    let alert = this.CustomAlert.create({
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
  setPin(): void {
    let emailRegx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
    let pinRegx = /^\d{4}$/;
    if (!this.pinData.pin) {
      this.showAlert('Please enter a 4-digit PIN to arm and disarm your site.', 'Validation');
      return
    } else if (!this.pinData.verifyPin) {
      this.showAlert('Please enter a 4-digit PIN to arm and disarm your site.', 'Validation');
      return;
    } else if (!this.pinData.pin.match(pinRegx)) {
      this.showAlert('Pin should not be more than 4 digits', 'Validation');
    } else if (this.pinData.pin !== this.pinData.verifyPin) {
      this.showAlert('Pins Don\'t match', 'Validation');
      return;
    } else if (!this.pinData.email) {
      this.showAlert('Email Empty', 'Validation');
    } else if (!this.pinData.email.match(emailRegx)) {
      this.showAlert('Enter a valid Email', 'Validation');
    }
    else {
      this.store.dispatch(this.userAction.setPin(this.pinData))
    }
  }
}
