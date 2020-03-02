import { ChangeDetectorRef, Component } from '@angular/core';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Store } from '@ngrx/store';
import { ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { VideoActions } from '../../actions/video.action';
import { User } from '../../models/user';
import { IAppState } from '../../reducers';

/**
 * Generated class for the videoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({ selector: 'page-video', templateUrl: 'video.html' })
export class VideoPage {
  private video: User;
  private videoDetails: any;
  private potentialID: string;
  private siteName: string;
  private header: string;
  private userSubscription: Subscription;

  // private videoPlayer: VideoPlayer;
  constructor(private store: Store<IAppState>,
    private userActions: UserActions,
    private videoActions: VideoActions,
    private modalCtrl: ModalController,
    private navActs: NavigationActions,
    private changeDetectorRef: ChangeDetectorRef,
    private streamingMedia: StreamingMedia) {
    this.fetchvideos();
    this.header = 'Dashboard'


  }

  ionViewDidLoad() {
    this.store.dispatch(this.videoActions.getvideos({ action: 'STATS', potentialid: this.potentialID, device: 'asd' }));
    this.changeDetectorRef.markForCheck();
  }
  navigateToStatsPage() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.STATS));
  }
  fetchvideos() {
    this.userSubscription = this.store.select(data => data)
      .subscribe(res => {
        this.siteName = res.potential.activePotential.siteName
        this.potentialID = res.potential.activePotential.potentialId || ''
        this.videoDetails = res.video ? res.video.video : []
      })
  }
  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }
  goToBack() {
    this.store.dispatch(this.navActs.navigateToPage(Pages.HOME))
  }
}
