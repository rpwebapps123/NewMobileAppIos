import { Action, ActionReducer } from '@ngrx/store';
import { EventsActions } from '../actions/events.action';
import { UserActions } from './../actions/user.actions';


export interface IStateEvents {
    allEvents: any[];
    eventDetails: any[];
    hasApiFailed: boolean
}

export const EventsReducer: ActionReducer<any> =
    (state: any = {
        allEvents: [],
        eventDetails: [],
        hasApiFailed: false,
        siteStats: {},
    }, action: Action) => {
        switch (action.type) {
            case EventsActions.FETCH_EVENT_BETWEEN_DATES_SUCCESS: {
                return Object.assign({}, state, { eventDetails: action.payload, hasApiFailed: false });
            }
            case EventsActions.FETCH_EVENT_BETWEEN_DATES_FAILED: {
                return Object.assign({}, state, { hasApiFailed: true });
            }
            case EventsActions.FETCH_SITE_STATS_SUCCESS: {
                return Object.assign({}, state, { siteStats: action.payload });
            }
            case EventsActions.SAVE_DATE: {
                return Object.assign({}, state, {selectedDate: action.payload});
            }
            case UserActions.LOGOUT:
                return Object.assign({}, state, {
                    allEvents: [],
                    eventDetails: [],
                    hasApiFailed: false,
                    siteStats: {},
                    selectedDate: ''
                });

            default:
                return state;
        };
    };