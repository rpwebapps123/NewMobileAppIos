import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { LoginData } from '../models/user';


@Injectable()
export class SitesActions {

    static SITES_LIST = 'SITES_LIST';
    loginSuccess(response: LoginData): Action {
        return {
            type: SitesActions.SITES_LIST,
            payload: response
        };
    }
}