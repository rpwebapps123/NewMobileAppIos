import { Network } from '@ionic-native/network';
import { Action, ActionReducer } from '@ngrx/store';
import { NavigationActions } from '../actions/navigation.actions';
import { UserActions } from '../actions/user.actions';
import { Navigation } from '../models/navigation';

var isOnline = true;
new Network().onConnect().subscribe(function () {
    isOnline = true
})
new Network().onDisconnect().subscribe(function () {
    isOnline = false
})

export const NavigationReducer: ActionReducer<Navigation> =
    (state: Navigation, action: Action) => {
        switch (action.type) {
            case NavigationActions.NAVIGATE_TO_PAGE: {
                // if (isOnline) {
                    return Object.assign({}, state, action.payload);
                // } else
                //     return state;
            }
            case NavigationActions.NAVIGATE_BACK: {
                return Object.assign({}, state, action.payload);
            }
            case NavigationActions.NAVIGATE_TO_DIALOG:
                return Object.assign({}, state, action.payload);
            case UserActions.LOGOUT:
                return {
                    Page: 0,
                    prevPage: 0,
                    headerConfig: {
                        showHeader: false,
                        showButton: false,
                        showBack: false,
                        showList: false,
                        title: false

                    }
                };
            default:
                return state;
        };
    };