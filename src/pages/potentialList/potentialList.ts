import { Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Store } from '@ngrx/store';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { CameraActions } from '../../actions/camera.actions';
import { EventsActions } from '../../actions/events.action';
import { MonitorActions } from '../../actions/monitor.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { PotentialActions } from '../../actions/potential.action';
import { UserActions } from '../../actions/user.actions';
import { IAppState } from '../../reducers';

@Component({
    selector: 'potentialListMenu',
    templateUrl: 'potentialList.html'
})
export class PotentialListMenu {
    userSubscription: Subscription
    items: Array<any> = [];
    list: any[] = [];
    formData: any;
    private searchString: string = '';
    private potentialID: string;
    pageNumber: number;
    activePotential: any;
    private defaultList: any[];
    private allSites: any[];
    errorMessage: string = '';
    constructor(
        private store: Store<IAppState>,
        private potentialActions: PotentialActions,
        private cameraActions: CameraActions,
        private userActions: UserActions,
        private device: Device,
        private toastCtrl: ToastController,
        private eventActions: EventsActions,
        private navActs: NavigationActions,
        private monitorActions: MonitorActions) {
    }
    ionViewDidEnter() {
        this.userSubscription = this.store.select(state => (state))
            .subscribe(state => {
                if (state.potential.list) {
                    this.allSites = state.potential.list;

                   this.list = this.allSites;//.slice(0, 20);
                    if(this.list.length <1){
                        this.errorMessage = 'No matching results found';
                    }
                    this.potentialID = state.potential.activePotential.potentialId || '';
                    this.pageNumber = state.navigation.prevPage;
                    this.activePotential = state.potential.activePotential;
                }
            })
    }
    back() {
        this.store.dispatch(this.navActs.navigateToPage(Pages.HOME));
    }
    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    private itemSelected(item): void {
         if (navigator.onLine) {
        //     window.localStorage.listselectSite= JSON.stringify(this.list[item]); 
        //     window.localStorage.allselectSite= JSON.stringify(this.allSites[item]); 
             this.store.dispatch(this.potentialActions.activePotentail(this.list[item]));             
            this.store.dispatch(this.navActs.navigateToPage(Pages.HOME));
            //this.store.dispatch(this.userActions.potentialListInActive());
          // this.store.dispatch(this.userActions.potentialListActive());
            // if (this.activePotential.potentialId !== item.potentialId) {
            //     this.store.dispatch(this.potentialActions.activePotentail(item));
            //     this.store.dispatch(this.potentialActions.updatePotential(item.potentialId));
            //     this.store.dispatch(this.monitorActions.monitorStatus({ event: 'MonitoringStatus', potentialid: item.potentialId }));
            //     this.store.dispatch(this.userActions.balanceDue({
            //         sfAccountId: item.sfaccountId
            //     }));
            // }
            // if (this.pageNumber === Pages.EVENT_LIST) {
            //     this.store.dispatch(this.navActs.navigateToPage(Pages.STATS));
            //     return;
            // } else {
            //     this.store.dispatch(this.navActs.navigateToPage(this.pageNumber));
            // }
        } else {
            this.showToast('You are currently offline. Please try again when online.');
        }
    }
    private doInfinite(infiniteScroll): void {
        if (!this.searchString) {
            setTimeout(() => {
                for (let i = 0; i < 20; i++) {
                    if (this.allSites[(this.list.length + i)]) {
                        this.list.push(this.allSites[(this.list.length + i)]);
                    }
                }
                infiniteScroll.complete();
            }, 500);
        } else {
            infiniteScroll.complete();
        }

    }
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
    }
    private getItems(): void {
       // if (this.searchString) {
            setTimeout(() => {
                this.list = this.allSites.filter((site) => {
                    return (site.siteName.toLowerCase().includes(this.searchString.toLowerCase()));
                });
                if(this.list && this.list.length == 0)
                this.errorMessage = 'No matching sites found';
            }, 100)
       // } else {
         //  this.list = this.allSites.slice(0, 20);
       // }

    }
}