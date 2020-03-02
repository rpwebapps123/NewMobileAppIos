import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { NavigationActions } from '../../actions/navigation.actions';
import { IAppState } from '../../reducers';

/**
 * Generated class for the SiteslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-siteslist',
  templateUrl: 'masking.html'
})
export class MaskingPage {
  maskingImages: any = [];
  private userSubscription: Subscription;
  private cameraId: string;
  cameraName: string;
  private cameraData: any = {};
  pvmUser: string;
  public viewType = 'cameraView';
  cameraImgView = '';
  maskingImageView = '';
  cameraNoImg = '';
  maskingNoImg = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
     private navActs: NavigationActions, private store: Store<IAppState>,
     private cd: ChangeDetectorRef) {
       this.pvmUser = window.localStorage.isPvmUser;
        this.userSubscription = this.store.select((state) => {
          return {
              navigation: state.navigation
          }
        })
        .subscribe(state => {
            this.cameraData = state.navigation ? state.navigation['NavParams'] : null;
            this.cameraName = (this.pvmUser === 'true') ? ((this.cameraData && this.cameraData.Name) ? this.cameraData.Name : '') : ((this.cameraData && this.cameraData.name) ? this.cameraData.name : '');
            this.cameraId = (this.pvmUser === 'true') ? ((this.cameraData && this.cameraData.CameraId) ? this.cameraData.CameraId : '') : (this.cameraData && this.cameraData.cameraId) ? this.cameraData.cameraId : '';
        });
          console.log('userType',this.pvmUser);
        if (this.pvmUser === 'true') {
          /* this.maskingImages.push(
            { srcimg :"../assets/images/daynightimg.png"},
            {srcimg:"../assets/images/daynightimg.png"},
            {srcimg:"../assets/images/daynightimg.png"},
            {srcimg:"../assets/images/daynightimg.png"},
            {srcimg:"../assets/images/daynightimg.png"},
            {srcimg:"../assets/images/daynightimg.png"},
          ) */
          this.cameraNoImg = 'Camera view is not available for this site';
          this.maskingNoImg = 'Masking view is not available for this site';
        } else {
          let potentialList = JSON.parse(window.localStorage.potential);
          let activePotential = potentialList.activePotential;
          let siteUrl = activePotential.url;
     /*      this.maskingImages.push(
            {srcimg:  `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=day`, title: 'Day View'},
            {srcimg: `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=night` , title: 'Night View'},
            {srcimg:  `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=day&overlay=Boundary`, title: 'Day View Boundry'},
            {srcimg: `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=night&overlay=Boundary`, title: 'Night View Boundry'}
           // {srcimg:  `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=day&overlay=Mask`},
          //{srcimg:  `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=night&overlay=Mask`},
          ); */

         this.cameraImgView = `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=day`;
         // this.cameraImgView = `http://18.215.71.9:8080/pro-vigil/CameraSnapShot?channel=Camera113&station=recordingStation&view=day`;
         this.maskingImageView = `${siteUrl}CameraSnapShot?channel=${this.cameraId}&station=recordingStation&view=day&overlay=Mask`;
          //this.maskingImageView = `http://18.215.71.9:8080/pro-vigil/CameraSnapShot?channel=Camera113&station=recordingStation&view=day&overlay=Mask`;
        }
      }

}
