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
  templateUrl: 'popup.html',
})
 
export class PopupPage {
myurl:any="";
notes: string = "";
armdisarm:string="";
status:string;
constructor( private popoverCtrl: PopoverController, public navParams: NavParams, public viewCtrl: ViewController) {
this.status = navParams.get('armdisarm');
this.armdisarm = (this.status === '0' || this.status === '4') ? 'Disarm' : 'Arm';
}
  ngOnInit() {}

  dismiss(){
      this.viewCtrl.dismiss({modal_status: 0 });
  }
  takeNotes(){
    this.viewCtrl.dismiss({modal_status: 1,  notes: this.notes});
  }
}
