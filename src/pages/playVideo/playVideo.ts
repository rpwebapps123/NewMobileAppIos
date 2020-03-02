
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { NavigationActions } from '../../actions/navigation.actions';
import { UserActions } from '../../actions/user.actions';
import { User } from '../../models/user';
import { IAppState } from '../../reducers';


@Component({
    selector: 'page-playvideo',
    templateUrl: 'playVideo.html'
})
export class PlayVideo {
    public users: Observable<User>;
    private email: string = '';
    private password: string = '';
    public errors: any = {};
    public errorMessage: string = '';
    private userSubscription: Subscription;

    constructor(
        private store: Store<IAppState>,
        private userActions: UserActions,
        private modalCtrl: ModalController,
        private navActs: NavigationActions) {
    }

}
