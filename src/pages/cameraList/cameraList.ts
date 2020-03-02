import { ChangeDetectorRef, Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Store } from '@ngrx/store';
import { Platform, ToastController } from 'ionic-angular';
import find from 'lodash/find';
import { Subscription } from 'rxjs';
import { CameraActions } from '../../actions/camera.actions';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { AppConfig, isDesktop } from '../../config/appConfig';
import { IAppState } from '../../reducers';
import { CameraList } from './../../models/user';

@Component({
    selector: 'cameraListMenu',
    templateUrl: 'cameraList.html'
})
export class CameraListMenu {
    userSubscription: Subscription
    items: any
    cameraList: Array<CameraList>
    formData: any
    searchItems: Array<any>
    potentialId: string;
    activeCamera: any;
    cameraListExists : boolean = undefined;
    private defaultList: Array<any>;
    constructor(
        private store: Store<IAppState>,
        private cameraActions: CameraActions,
        private toastCtrl: ToastController,
        private userActions: UserActions,
        private navActs: NavigationActions,
        private cd: ChangeDetectorRef,
        public platform: Platform,
        private screenOrientation: ScreenOrientation) {

            platform.ready().then(() => {
                if(!isDesktop) {
                    if (AppConfig.isScreenLock) {
                        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
                    }
                }
            }).catch(err => {
                console.log('Error while loading platform', err);
        });

    }
    ionViewDidEnter() { 
        this.userSubscription = this.store.select(state =>
            ({ camera: state.camera, potential: state.potential }))
            .subscribe(state => {
                this.potentialId = state.potential.activePotential
                    ? state.potential.activePotential.potentialId : '';
                this.activeCamera = state.camera.ActiveCamera ? state.camera.ActiveCamera : {};
                this.items = state.camera.List ? (
                    state.camera.List[this.potentialId] ?
                        state.camera.List[this.potentialId].map((cameraList) => {
                            return (cameraList.Name)
                        }) : []) : [];
                this.cameraList = state.camera.List ?
                    state.camera.List[this.potentialId] : [];
                this.searchItems = this.items; 
                this.defaultList = this.items.slice();
                Object.freeze(this.defaultList);  //so that this cannot be changed and always be used as reference.

                this.cameraListExists = this.cameraList ? (this.cameraList.length>0 ? true:false) :false;

                this.cd.detectChanges();
            })
    }
    
    itemSelected(item) {
        if(navigator.onLine){
        this.formData = find(this.cameraList, { Name: item });
        this.store.dispatch(this.userActions.cameraListInActive());
        this.store.dispatch(this.cameraActions.activeCamera(this.formData));
        this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA));
        }else{
            this.showToast('You are currently offline, check network and try again.');    
        }
    }

    navigateToCameraHdViewPage(item) {

        if(navigator.onLine){
            this.store.dispatch(this.navActs.navigateToPage(Pages.CAMERA_HD_VIEW_PAGE, false, item,Pages.CAMERA_LIST_MENU));
            }else{
                this.showToast('You are currently offline, check network and try again.');    
            }
       
    }

    private showToast(message: string) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
    }
    getItems(ev) {
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.items = this.items.filter((item) => {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            return true;
        } else {
            this.items = this.defaultList

        }
    }
}