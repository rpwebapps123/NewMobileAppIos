import { ChangeDetectorRef, Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { Store } from '@ngrx/store';
import { AlertController, LoadingController, ModalController, Platform, ToastController, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { NavigationActions } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { VideoActions } from '../../actions/video.action';
import { User } from '../../models/user';
import { IAppState } from '../../reducers';
import { isDesktop } from './../../config/appConfig';





@Component({
  selector: 'stats-video-data',
  templateUrl: 'stats-video-data.html'
})
export class StatsVideoDataComponent {
  private video: User;
  private videoDetails: any;
  private potentialID: string;
  private siteName: string;
  private statedata: any;
  private showBtn: boolean = false;
  private userSubscription: Subscription;
  private loading: any;
  private numberOfVideos: number = 0;
  private isDesktopEnabled: boolean;


  constructor(private store: Store<IAppState>,
    private userActions: UserActions,
    private videoActions: VideoActions,
    private modalCtrl: ModalController,
    private navActs: NavigationActions,
    private cd: ChangeDetectorRef,
    private LoadingCtrl: LoadingController,
    private CustomAlert: AlertController,
    private transfer: FileTransfer,
    private file: File,
    //private photoLibrary: PhotoLibrary,
    private device: Device,
    private androidPermissions: AndroidPermissions,
    private streamingMedia: StreamingMedia,
    private platform: Platform,
    private toastCtrl: ToastController,
    private viewController: ViewController) {
    this.loading = this.LoadingCtrl.create({
      content: 'Fetching clip...'
    });
  }
  private removePreviousVideos(): void {
    let allVideos = document.getElementsByTagName('video');
    if (allVideos) {
      for (var v = 0; v < allVideos.length; v++) {
        allVideos[v].remove();
      }
    }
  }
  ngOnInit() {
    this.fetchvideos();
  }
  fetchvideos() {
    this.removePreviousVideos();
    this.userSubscription = this.store.select(data => data)
      .subscribe(res => {
        this.siteName = res.potential.activePotential.siteName;
        this.potentialID = res.potential.activePotential.potentialId || '';
        this.videoDetails = (res.video && res.video.videoList) ? res.video.videoList : [];
        this.statedata = res.eventList ? res.eventList.statedata : '';
        this.showBtn = false;
        this.cd.detectChanges();
      });
  }


  ionViewWillLeave() {
    this.showBtn = false;
    this.userSubscription.unsubscribe();
  }

  decrementVideoNumber() {
    if (this.numberOfVideos >= 1) {
      this.numberOfVideos--;
    }
    this.cd.detectChanges();
  }


  playVideoInNativePlayer(url: string) {
    let options: StreamingVideoOptions = {
      successCallback: () => {
       this.loading.dismiss();
      },
      errorCallback: (e) => {
        this.loading.dismiss();
      }
    };
    this.streamingMedia.playVideo(url, options);
  }
  private dismissLoaderAsync(): void {
    setTimeout(() => {
      this.loading.dismiss();
    }, 5000)
  }

  private downloadAndSaveVideo(index: number): void {
    this.numberOfVideos++;
    const url: string = this.videoDetails[index].clipUrl;
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download((url + '?' + new Date().getTime().toString()), this.file.dataDirectory + new Date().getTime().toString() + '.mp4').then((entry) => {// download Complete
      // try {
      //   this.moveToGallery(entry);
      // } catch (e) {
      //   this.decrementVideoNumber();
      //   this.showToast(`Error while dowloading video, device offline. Please try again when online.`);
      // }
    }).catch((e) => {
      this.decrementVideoNumber();
      this.showToast(`Error while dowloading video, device offline. Please try again when online.`);
    });
  }

  private playPauseClickedVideo(videoIndex): void {
      if (navigator.onLine) {
        this.loading.present();
        const videoUrl: string = this.videoDetails[videoIndex].clipUrl;
        var xhttp = new XMLHttpRequest();
        let that = this;
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && (String(this.status)[0] === '2')) {
            if (that.platform.is('android')) {
              that.playVideoInNativePlayer(videoUrl);
            } else {
              that.showBtn = true;
              let currentVideoElement: HTMLVideoElement = document.getElementById('stats-video-' + videoIndex) as HTMLVideoElement;
              let playBtn = document.getElementById('playBtn-' + videoIndex);
              try {
                if (currentVideoElement.paused) {
                  currentVideoElement.play();
                  playBtn.classList.remove('paused');
                  playBtn.classList.add('playing');
                  that.loading.dismiss();
                } else {
                  currentVideoElement.pause();
                  playBtn.classList.remove('playing');
                  playBtn.classList.add('paused');

                }
              } catch (e) {
                console.error('Error playing video', e);
              }
            }
          } else if (this.readyState == 4 && this.status !== 200) {
            that.dismissLoaderAsync()
            alert('Clip not found.');
          }
        };
        xhttp.open("GET", videoUrl, true);
        xhttp.send();
      } else {
        this.showToast('You are currently offline.The video can not be played.');
      }
  }

  takeScreenShot(index): void {
      if (navigator.onLine) {
        const xhttp = new XMLHttpRequest();
        const that = this;
        const loader = this.LoadingCtrl.create();
        loader.present();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && (String(this.status)[0] === '2')) {
            that.downloadAndSaveVideo.call(that, index);
            loader.dismiss();
            that.showToast(`Clip Download Started. `);
          } else if (this.readyState == 4 && (String(this.status)[0] !== '2')) {
            that.showToast.call(that, `Error while dowloading : Video not found.`);
            loader.dismiss();
          }
        }
        xhttp.open("GET", this.videoDetails[index].clipUrl, true);
        xhttp.send();
      } else {
        this.showToast('Error while dowloading video, device offline. Please try again when online.');
      }
  }

  makeFullScreen(i: number): void {
    const videoId = 'stats-video-' + i.toString();
    let videoElemt: any = document.getElementById(videoId) as HTMLVideoElement;
    if (videoElemt.requestFullscreen) {
      videoElemt.requestFullscreen();
    } else if (videoElemt.mozRequestFullScreen) {
      videoElemt.mozRequestFullScreen();
    } else if (videoElemt.webkitRequestFullscreen) {
      videoElemt.webkitRequestFullscreen();
    }

  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    this.decrementVideoNumber();
    toast.present();
  }

}
