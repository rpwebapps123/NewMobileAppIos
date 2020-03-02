import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class StatsActions {

    static GET_CURRENT_STATS_LIST = 'GET_CURRENT_STATS_LIST';
    fetchCurrentStats(statsInfo: any): Action {
        return {
            payload: statsInfo,
            type: StatsActions.GET_CURRENT_STATS_LIST
        };
    }

    static CURRENT_STATS_LIST_SUCCESS = 'CURRENT_STATS_LIST_SUCCESS';
    currentStatsSuccess(response: any): Action {
        return {
            payload: response,
            type: StatsActions.CURRENT_STATS_LIST_SUCCESS
        };
    }
    static GET_HISTORY_STATS_LIST = 'GET_HISTORY_STATS_LIST';
    fetchHistoryStats(statsInfo: any): Action {
        return {
            payload: statsInfo,
            type: StatsActions.GET_HISTORY_STATS_LIST
        };
    }

    static HISTORY_STATS_LIST_SUCCESS = 'HISTORY_STATS_LIST_SUCCESS';
    historyStatsSuccess(response: any): Action {
        return {
            payload: response,
            type: StatsActions.HISTORY_STATS_LIST_SUCCESS
        };
    }
    static GET_CLIPS_STATS_LIST = 'GET_CLIPS_STATS_LIST';
    fetchClipsStats(statsInfo: any): Action {
        return {
            payload: statsInfo,
            type: StatsActions.GET_CLIPS_STATS_LIST
        };
    }

    static CLIPS_STATS_LIST_SUCCESS = 'CLIPS_STATS_LIST_SUCCESS';
    clipsStatsSuccess(response: any): Action {
        return {
            payload: response,
            type: StatsActions.CLIPS_STATS_LIST_SUCCESS
        };
    }
}