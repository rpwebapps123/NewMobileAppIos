import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions/navigation.actions';
import { IAppState } from '../../reducers';
import { UserActions } from './../../actions/user.actions';

@Component({
  selector: 'pageBalanceDue',
  templateUrl: 'balanceDue.html',
})
export class BalanceDuePage {
  userSubscription: Subscription
  potentialId: string;
  sfAccountId: string;
  balanceDue: any;
  displayAddress: string
  constructor(private store: Store<IAppState>,
    private navActs: NavigationActions,
    private cd :ChangeDetectorRef,
    private userActions: UserActions) {

  }
  ionViewWillEnter() {
    this.userSubscription = this.store.select((state) => {
      return { balanceDue: state.user.balanceDue, potential: state.potential }
    })
      .subscribe(state => {
        this.balanceDue = state.balanceDue;
        let { BillingAddress } = JSON.parse(JSON.stringify(this.balanceDue));
        if (Object.keys(this.balanceDue).length) {
          let { street, city, state, country } = BillingAddress;
          this.displayAddress = '';
          if (street) {
            this.displayAddress = this.displayAddress + ' ' + street;
          } if (city) {
            this.displayAddress = this.displayAddress + ' ' + city;
          } if (state) {
            this.displayAddress = this.displayAddress + ' ' + state;
          } if (country) {
            this.displayAddress = this.displayAddress + ' ' + country;           
          }
          this.cd.detectChanges();
        }
        this.sfAccountId = state.potential.activePotential.sfaccountId;
      })


    // this.store.dispatch(this.userActions.balanceDue({
    //   sfAccountId: this.sfAccountId
    // }));
  }


}
