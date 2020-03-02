import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { IDateRange } from '../models';


@Injectable()
export class EventsActions {

    static FETCH_EVENT_BETWEEN_DATES = 'FETCH_EVENT_BETWEEN_DATES';
    fetchEventsBetweenDates(dateRange: IDateRange): Action {
        return {
            type: EventsActions.FETCH_EVENT_BETWEEN_DATES,
            payload: dateRange
        };
    }

    static FETCH_EVENT_BETWEEN_DATES_SUCCESS = 'FETCH_EVENT_BETWEEN_DATES_SUCCESS';
    fetchEventsBetweenDatesSuccess(eventsList: any[]): Action {
        return {
            type: EventsActions.FETCH_EVENT_BETWEEN_DATES_SUCCESS,
            payload: eventsList
        };
    }

    static FETCH_EVENT_BETWEEN_DATES_FAILED = 'FETCH_EVENT_BETWEEN_DATES_FAILED';
    fetchEventsBetweenDatesFailed(): Action {
        return {
            type: EventsActions.FETCH_EVENT_BETWEEN_DATES_FAILED,
        };
    }

    static FETCH_SITE_STATS = 'FETCH_SITE_STATS';
    fetchSiteStats(queryParams:any): Action {
        return {
            type: EventsActions.FETCH_SITE_STATS,
            payload:queryParams
        };
    }

    static FETCH_SITE_STATS_SUCCESS = 'FETCH_SITE_STATS_SUCCESS';
    fetchSiteStatsSuccess(siteStats:any): Action {
        return {
            type: EventsActions.FETCH_SITE_STATS_SUCCESS,
            payload:siteStats
        };
    }

    static SAVE_DATE = 'SAVE_DATE';
    saveDate(date:any): Action {
        return {
            type: EventsActions.SAVE_DATE,
            payload: date
        }
    }

}