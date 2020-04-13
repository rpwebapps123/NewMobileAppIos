import { Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Store } from '@ngrx/store';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { CameraHealthActions } from '../../actions/camerahealth.action';
import { EventsActions } from '../../actions/events.action';
import { MonitorActions } from '../../actions/monitor.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { CameraList } from '../../models';
import { IAppState } from '../../reducers';
 

@Component({
    selector: 'cameraListMenu',
    templateUrl: 'camerahealth.html'
})
export class CameraHealthListMenu {
    userSubscription: Subscription
    items: Array<any> = [];
    list: any[] = [];
    formData: any;
    private searchString: string = '';
    private potentialId: string ='a1Y1J000004QTwDUAW';
    pageNumber: number;
    activePotential: any;
    private defaultList: any[];
    private allSites: any[];
    errorMessage: string = '';
    private cameraList: Array<CameraList>;
    private unitId: string;
    private siteName: string;
    constructor(
        private store: Store<IAppState>,        
        private cameraHealthActions: CameraHealthActions,
        //private userActions: UserActions,
        private device: Device,
        private toastCtrl: ToastController,
        private eventActions: EventsActions,
        private navActs: NavigationActions,
        private monitorActions: MonitorActions) {
    }
    ionViewDidEnter() {
       
        this.userSubscription = this.store.select(state => (state))
            .subscribe(state => {
                    this.potentialId = state.potential.activePotential ? state.potential.activePotential.potentialId : '';
                    this.cameraList = state.camera ? state.camera.List ? state.camera.List[this.potentialId] : [] : [];
                    this.unitId = (state.potential.activePotential && state.potential.activePotential.unitId) ? state.potential.activePotential.unitId : '';
                    this.siteName = state.potential.activePotential ? state.potential.activePotential.siteName : '';
                  
                //{ event: 'potential', potentialid: this.potentialId,unitId: this.unitId, isFetchImage: 'false', siteName: this.siteName }
            });
            this.store.dispatch(this.cameraHealthActions.fetchCamerasList({ potentialid: this.potentialId, siteName: this.siteName, unitId: this.unitId}));
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
        if (this.searchString) {
            setTimeout(() => {
                this.list = this.allSites.filter((site) => {
                    return (site.siteName.toLowerCase().includes(this.searchString.toLowerCase()));
                });
            }, 100)
        } else {
            this.list = this.allSites.slice(0, 20);
        }

    }
}