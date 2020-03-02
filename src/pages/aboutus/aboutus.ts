import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform, ToastController } from 'ionic-angular';
import { AppConfig } from '../../config/appConfig';

/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
// export class AboutusPage {

//   constructor(public navCtrl: NavController, public navParams: NavParams, public inAppBrowser: InAppBrowser) {
//      const browser = this.inAppBrowser.create(AppConfig['pvmServiceRequests'].aboutUsUrl, '_self', {location:'no'});   
//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad AboutusPage');
//   }

// }

export class AboutusPage {
myurl:any="";
constructor(private toastCtrl: ToastController, private inAppBrowser: InAppBrowser, private platform: Platform) {
  this.platform.ready().then(() => {
 if (navigator.onLine) {
      const browser = this.inAppBrowser.create(AppConfig['pvmServiceRequests'].aboutUsUrl, '_blank', 'location=no');
    } else {
        this.showToast('You are currently offline. Please try again when online.');
      } 
    });
}
  ngOnInit() {

   

}

private showToast(message: string) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

}
