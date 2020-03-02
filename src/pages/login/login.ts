import { Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { SplashScreen } from "@ionic-native/splash-screen";
import { Store } from '@ngrx/store';
import { AlertController, ModalController, Platform, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { NavigationActions, Pages } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { isDesktop } from '../../config/appConfig';
import { User } from '../../models/user';
import { IAppState } from '../../reducers';
import { SlideInOutAnimation } from './animation';
import moment from 'moment-timezone';


@Component({
    selector: 'login-page',
    templateUrl: 'login.html',
    animations: [ SlideInOutAnimation ]
})
export class Login {

    
    public users: Observable<User>;
    private email: string = '';
    private password: string = '';
    private keepLogin:boolean=false;
    private isChecked:string='false';
    public errors: any = {};
    public errorMessage: string = '';
    private userSubscription: Subscription;
    private isNavigated: boolean = false;
    private isLoggedIn:boolean=true;
    private isIosPlatform:boolean=false;
    animationState = 'in';
    momentjs: any = moment;
    constructor(
       
        private store: Store<IAppState>,
        private userActions: UserActions,
        private device: Device,
        private splashscreen: SplashScreen,
        private modalCtrl: ModalController,
        private CustomAlert: AlertController,
        private toastCtrl: ToastController,
        platform: Platform,
        private navActs: NavigationActions) {
        window.localStorage.isLoggedIn = false;
        //window.localStorage.keeploggedIn="false";//setItem('keeploggedIn', 'false');
        platform.ready().then(() => {

                setTimeout(()=>{
                    this.animationState =  'out';
                },1000)

                if(platform.is('ios')){
                    this.isIosPlatform = true;
                } else{
                    this.isIosPlatform = false;
                }
        })

    }
    
    // checked : boolean = false;	
    // keepLoggedIn(e:any): void {
    //       this.checked = !this.checked;
    //       console.log("checked: " + this.checked);//it is working !!!
    //      this.keepLogin=this.checked;
    //       window.localStorage.keeploggedIn=this.checked;
    //       console.log("checked: " +  window.localStorage.keeploggedIn);//it is working !!!
    // }
    checkValue(event: any){
        console.log(event);
        this.isChecked=event;
      
        //window.localStorage.keeploggedIn=event;
        //window.localStorage.setItem("keeploggedIn",event);
        // window.localStorage.then(() => {
        //   localStorage.setItem("keeploggedIn",event);
        // //     });
        // setTimeout(() => {
        //     window.localStorage.keeploggedIn=event;
        // }, 1000);
       // this.keeplogin(event);
       //window.localStorage.setItem("keeploggedIn",event);
        //console.log("checked: " +  window.localStorage.keeploggedIn);//it is working !!!
        //return false;
     }
    ionViewWillEnter() {       
        this.userSubscription = this.store
            .select((state) => ({ user: state.user, potential: state.potential}))
            .subscribe(state => {
                this.isLoggedIn = state.user.IsLoggedin;            
                if ((state.user.IsLoggedin && !this.isNavigated)) {           
                    //this.showAlert(localStorage.getItem("keeploggedIn"),'Message');           
                        this.isNavigated = true;
                        this.keeploggedIn(this.isChecked);
                        window.localStorage.loginTime =  this.momentjs.utc().add('60','minute').format('x');
                        let potentialList = state.potential.list.length;
                        if(potentialList > 1){
                            this.store.dispatch(this.navActs.navigateToPage(Pages.SITES_LIST));
                            //return;
                        } else {
                            this.store.dispatch(this.navActs.navigateToPage(Pages.HOME));
                            //return;
                        }
                      
                            this.splashscreen.hide();                   
                            if (this.userSubscription) {
                           this.userSubscription.unsubscribe();
                    }
                    return;
                }
            })
            
           
    }
    keeploggedIn(event)
    {
       // console.log(event);
      //  if(navigator.onLine){
           // this.showAlert(window.localStorage.keeploggedIn,'Before');
            if(window.localStorage.keeploggedIn=="false" || window.localStorage.keeploggedIn== undefined)
            {
            window.localStorage.keeploggedIn=event;
            //this.showAlert(window.localStorage.keeploggedIn,'Message');
            }
        //}
         
    }
    validationHandler(): boolean {
        this.errors = {};
        if (!this.email) {
            this.errors.email = 'Email Required';
        }
        if (!this.password) {
            this.errors.password = 'Password Required';
        }
        return Object
            .keys(this.errors)
            .length === 0;
    }

    private showToast(message: string) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    showAlert = (message: string, title: string) => {
            let alert = this.CustomAlert.create({
                            message: message,
                            title: title,
                            enableBackdropDismiss: false,
                            cssClass: 'custum_alert',
                            buttons: [{
                                text: 'Ok',
                                handler: () => {
                                    // alert.dismiss();
                                }
                            }]
                        });
        alert.present();
}
    doLogin(): void {
        
        if(navigator.onLine){
        // if (!this.validationHandler()) {
        //     return;
        // }
      
        if (this.email.trim() === '' &&  this.password.trim() === '') {
           this.showAlert('Please enter username and password', 'Error');
        } else if(this.email.trim() === '') {
            this.showAlert('Please enter username.', 'Error');
        } else if(this.password.trim() === '') {
            this.showAlert('Please enter password.', 'Error');
        } else {
            
            this.store.dispatch(this.userActions.userLogin({
                action: 'LOGIN',
                userName: this.email,
                password: this.password,
                //TODO remove random
                deviceId: (this.device.uuid ? this.device.uuid : null)
            }))
        }
        }else{
            this.showToast('You are currently offline.Please check Internet connection'); 
        }
      
    }
    // keeplogin(event: any): void {
     
    //     if(typeof(window.localStorage.keeploggedIn) === "undefined" || window.localStorage.keeploggedIn=='false')
    //             {      
    //                   window.localStorage.keeploggedIn=this.isChecked;
    //                   this.showAlert(window.localStorage.keeploggedIn,'Message');
    //                   return;
    //             }
    // }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}
