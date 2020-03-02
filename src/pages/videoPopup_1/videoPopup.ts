import { Component } from '@angular/core';
import { NavParams, PopoverController, ViewController } from 'ionic-angular';
/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'popup-page',
  templateUrl: 'videoPopup.html'
})
 
export class VideoPopupPage {
  public url : string;
constructor( private popoverCtrl: PopoverController, public navParams: NavParams, public viewCtrl: ViewController) {
this.url = navParams.get('url');
}
  ngOnInit() {}

  dismiss(){
      this.viewCtrl.dismiss({modal_status: 0 });
  }
}
