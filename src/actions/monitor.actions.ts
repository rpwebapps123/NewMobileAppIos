import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class MonitorActions {
    static MONITOR_HOURS = 'MONITOR_HOURS';
    monitorHours(mhrs: any): Action {
        return {
            type: MonitorActions.MONITOR_HOURS,
            payload: mhrs
        };
    }
    static MONITOR_HOURS_SUCCESS = 'MONITOR_HOURS_SUCCESS';
    monitorHoursSuccess(data): Action {
        return {
            type: MonitorActions.MONITOR_HOURS_SUCCESS,
            payload: data
        };
    }
    static MONITORING_STATUS = 'MONITORING_STATUS';
    monitorStatus(data): Action {
        return {
            type: MonitorActions.MONITORING_STATUS,
            payload: data
        };
    }
    static MONITORING_STATUS_SUCCESS = 'MONITORING_STATUS_SUCCESS';
    monitorStatusSuccess(data): Action {
        return {
            type: MonitorActions.MONITORING_STATUS_SUCCESS,
            payload: data
        };
    }
    static MONITORING_UNIT = 'MONITORING_UNIT';
    monitorUnit(STATUS: any): Action {
        return {
            type: MonitorActions.MONITORING_UNIT,
            payload: STATUS
        };
    }
    static MONITORING_UNIT_SUCCESS = 'MONITORING_UNIT_SUCCESS';
    monitorUnitSuccess(data): Action {
        return {
            type: MonitorActions.MONITORING_UNIT_SUCCESS,
            payload: data
        };
    }

}