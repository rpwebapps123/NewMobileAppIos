import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class EventListAction {

    static STATE_DATA = 'STATE_DATA';
    stateData(eventList: any): Action {
        return {
            type: EventListAction.STATE_DATA,
            payload: eventList
        };
    }
    static GET_STATEDETAILS_SUCESS = 'GET_STATEDETAILS_SUCESS';
    getStateDEtails(result: any): Action {
        return {
            type: EventListAction.GET_STATEDETAILS_SUCESS,
            payload: result,
        };
    }
}