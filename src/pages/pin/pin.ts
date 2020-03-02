import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertController } from 'ionic-angular';
import { PincodeController } from 'ionic2-pincode-input/dist/pincode';
import { Subscription } from 'rxjs';
import { IAppState } from '../../reducers';

@Component({
  selector: 'page-pin',
  templateUrl: 'pin.html',
})
export class PinPage {
  code: string
  title: string
  userSubscription: Subscription

  constructor(public pincodeCtrl: PincodeController, private alertCtrl: AlertController, private store: Store<IAppState>, ) {
        this.title = 'PIN'
  }

  ngOnInit() {

  }
  private handlePIN: (pincode: string) => Promise<any> = (pincode: string) => {
    if (pincode === '1234') {
      return Promise.reject('');
    } else {
      return Promise.resolve();
    }
  };
  openPinCode(): any {
    let pinCode = this.pincodeCtrl.create({
      hideToolbar: true,
      passSize: 4,
      enableBackdropDismiss: true,
      pinHandler: this.handlePIN,

    });
    pinCode.present();
    pinCode.onDidDismiss((code, status) => {
      if (status === 'done') {
        this.code = code;
      } else if (status === 'forgot') {
        // forgot password
      }
    })
  }

}
