import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { VideoList } from '../models/user';

@Injectable()
export class VedioActions {
    static GET_VEDIOS_SUCCESS = 'GET_VEDIOS_SUCCESS';
    getVedioSuccess(response: any): Action {
        return {
            type: VedioActions.GET_VEDIOS_SUCCESS,
            payload: response
        };
    }
    static GET_VEDIOS = 'GET_VEDIOS';
    getVedios(vedio?:string): Action {
        return {
            type: VedioActions.GET_VEDIOS,
            payload: vedio
        };
    }
    
}