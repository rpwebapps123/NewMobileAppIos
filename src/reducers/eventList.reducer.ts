import { Action, ActionReducer } from '@ngrx/store';
import { EventListAction } from '../actions/eventList.action';
import { UserActions } from './../actions/user.actions';




export interface IEventListState {
    statedata: any;
}

const initialState: IEventListState = {
    statedata: {}
}

export const EventListReducer: ActionReducer<any> =
    (state: IEventListState = initialState, action: Action) => {
        switch (action.type) {
            case EventListAction.GET_STATEDETAILS_SUCESS:
                return Object.assign({}, state, {
                    statedata: action.payload
                });
            case UserActions.LOGOUT:
                return Object.assign({}, state, {
                    statedata: {}
                });
            default:
                return state;
        };
    };