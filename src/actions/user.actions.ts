import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { LoginData } from '../models/user';


@Injectable()
export class UserActions {

    //PRO-VIGIL ACTIONS 
    static USER_LOGIN = 'USER_LOGIN';
    userLogin(loginInfo: any): Action {
        return {
            type: UserActions.USER_LOGIN,
            payload: loginInfo
        };
    }
    //I-VIGIL LOGIN ACTIONS 
    static USER_IVIGIL_LOGIN = 'USER_IVIGIL_LOGIN';
    userIvigilLogin(loginInfo: any): Action {
        return {
            type: UserActions.USER_IVIGIL_LOGIN,
            payload: loginInfo
        };
    }
    static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
    loginSuccess(response: LoginData): Action {
        return {
            type: UserActions.LOGIN_SUCCESS,
            payload: response
        };
    }

    static LOGOUT = 'LOGOUT';
    logout(): Action {
        return {
            type: UserActions.LOGOUT
        };
    }


    static DIS_ARM_CAMERA = 'DIS_ARM_CAMERA';
    disarmCamera(disarmCamera: any): Action {
        return {
            type: UserActions.DIS_ARM_CAMERA,
            payload: disarmCamera
        };
    }


    static GET_ARM_STATE = 'GET_ARM_STATE';
    getArmState(disarmCamera: any): Action {
        return {
            type: UserActions.GET_ARM_STATE,
            payload: disarmCamera
        };
    }

    static GET_SERVER_TIME = 'GET_SERVER_TIME';
    getServerTime(payload: any): Action {
        return {
            type: UserActions.GET_SERVER_TIME,
            payload: payload
        };
    }

    static SAVE_LOG = 'SAVE_LOG';
    saveLogsToServer(payload: any): Action {
        return {
            type: UserActions.SAVE_LOG,
            payload: payload
        };
    }

    static GET_SURVIEW_ARM_STATE = 'GET_SURVIEW_ARM_STATE';
    getSurviewArmState(disarmCamera: any): Action {
        return {
            type: UserActions.GET_SURVIEW_ARM_STATE,
            payload: disarmCamera
        };
    }

    static GET_ARM_STATE_SUCCESS = 'GET_ARM_STATE_SUCCESS';
    getArmStateSuccess(armState: any): Action {
        return {
            type: UserActions.GET_ARM_STATE_SUCCESS,
            payload: armState
        };
    }

    static GET_SITE_TIME_SUCCESS = 'GET_SITE_TIME_SUCCESS';
    getSiteTimeSuccess(siteTime: any): Action {
        return {
            type: UserActions.GET_SITE_TIME_SUCCESS,
            payload: siteTime
        };
    }

   

    static GET_CAMERA_STATUS_INFO = 'GET_CAMERA_STATUS_INFO';
    getCameraStatusInfo(info: any): Action {
        return {
            type: UserActions.GET_CAMERA_STATUS_INFO,
            payload: info
        }
    }


    static SAVE_ARM_DISARM_STATUS_INFO = 'SAVE_ARM_DISARM_STATUS_INFO';
    saveArmDisArmStatusInfo(info: any): Action {
        return {
            type: UserActions.SAVE_ARM_DISARM_STATUS_INFO,
            payload: info
        }
    }

    static SAVE_CAMERA_STATUS_INFO = 'SAVE_CAMERA_STATUS_INFO';
    saveCameraStatusInfo(info: any): Action {
        return {
            type: UserActions.SAVE_CAMERA_STATUS_INFO,
            payload: info
        }
    }

    static POST_MANAGE_ALARM = 'POST_MANAGE';
    ticketing(ticketing: any): Action {
        return {
            type: UserActions.POST_MANAGE_ALARM,
            payload: ticketing
        };
    }

    static POST_CREATE_TICKET = 'CREATE_TICKET';
    createTicket(ticektData: any): Action {
        return {
            type: UserActions.POST_CREATE_TICKET,
            payload: ticektData
        };
    }

    static SET_LIST_TICKET = 'SET_LIST_TICKET';
    setListTicket(): Action {
        return {
            type: UserActions.SET_LIST_TICKET
        };
    }

    static POST_LIST_TICKET = 'TICKET_LIST';
    listTicket(ticektData: any): Action {
        return {
            type: UserActions.POST_LIST_TICKET,
            payload: ticektData
        };
    }

    static SET_TICKET_DATA = 'SET_TICKET_DATA';
    setTicketListData(ticektData: any): Action {
        return {
            type: UserActions.SET_TICKET_DATA,
            payload: ticektData
        };
    }

    static SET_EVENTLOG_DATA = 'SET_EVENTLOG_DATA';
    setEventLogData(eventLogData: any): Action {
        return {
            type: UserActions.SET_EVENTLOG_DATA,
            payload: eventLogData
        };
    }

    static SET_EVENTLOGVIDEO_DATA = 'SET_EVENTLOGVIDEO_DATA';
    setEventLogVideoData(eventLogVideoData: any): Action {
        return {
            type: UserActions.SET_EVENTLOGVIDEO_DATA,
            payload: eventLogVideoData
        };
    }

    static SET_TICKET_ERROR_DATA = 'SET_TICKET_ERROR_DATA';
    setTicketErrorData(ticektErrorData: any): Action {
        return {
            type: UserActions.SET_TICKET_ERROR_DATA,
            payload: ticektErrorData
        };
    }
    
    static REFRESH_TICKET_DATA = 'REFRESH_TICKET_DATA';
    refreshTicketListData(ticektData: any): Action {
        return {
            type: UserActions.REFRESH_TICKET_DATA,
            payload: ticektData
        };
    }

    static POST_EVENT_LOG = 'POST_EVENT_LOG';
    getEventLog(requestData: any): Action {
        return {
            type: UserActions.POST_EVENT_LOG,
            payload: requestData
        };
    }

    static GET_EVENT_VIDEO = 'GET_EVENT_VIDEO';
    getEventLogVideos(requestData: any): Action {
        return {
            type: UserActions.GET_EVENT_VIDEO,
            payload: requestData
        };
    }

    static SURVIEW_ARM_STATE_SUCCESS = 'GSURVIEW_ARM_STATE_SUCCESS';
    surviewArmStateSuccess(armState: any): Action {
        return {
            type: UserActions.SURVIEW_ARM_STATE_SUCCESS,
            payload: armState
        };
    }

    static SERVIEW_ARM_CAMERA = 'SERVIEW_ARM_CAMERA';
    surviewArmCamera(armData: any): Action {
        return {
            type: UserActions.SERVIEW_ARM_CAMERA,
            payload: armData
        };
    }

    static SERVIEW_DISARM_ARM_CAMERA = 'SERVIEW_DISARM_ARM_CAMERA';
    surviewDisArmCamera(disArmData: any): Action {
        return {
            type: UserActions.SERVIEW_DISARM_ARM_CAMERA,
            payload: disArmData
        };
    }


    static SERVIEW_ARM_CAMERA_SUCCESS = 'SERVIEW_ARM_CAMERA_SUCCESS';
    surviewArmCameraSuccess(armData: any): Action {
        return {
            type: UserActions.SERVIEW_ARM_CAMERA_SUCCESS,
            payload: armData
        };
    }

    static SERVIEW_DISARM_ARM_CAMERA_SUCCESS = 'SERVIEW_DISARM_ARM_CAMERA_SUCCESS';
    surviewDisArmStateSuccess(disArmData: any): Action {
        return {
            type: UserActions.SERVIEW_DISARM_ARM_CAMERA_SUCCESS,
            payload: disArmData
        };
    }

    static POTENTIAL_LIST_ACTIVE = 'POTENTIAL_LIST_ACTIVE';
    potentialListActive(): Action {
        return {
            type: UserActions.POTENTIAL_LIST_ACTIVE
        };
    }

    static POTENTIAL_LIST_INACTIVE = 'POTENTIAL_LIST_INACTIVE';
    potentialListInActive(): Action {
        return {
            type: UserActions.POTENTIAL_LIST_INACTIVE
        };
    }


    static CAMERA_LIST_ACTIVE = 'CAMERA_LIST_ACTIVE';
    cameraListActive(): Action {
        return {
            type: UserActions.CAMERA_LIST_ACTIVE
        };
    }

    static CAMERA_LIST_INACTIVE = 'CAMERA_LIST_INACTIVE';
    cameraListInActive(): Action {
        return {
            type: UserActions.CAMERA_LIST_INACTIVE
        };
    }
    static SET_USER_SEEN_TUTORIAL = 'SET_USER_SEEN_TUTORIAL';
    setUserSeenTutorial(): Action {
        return {
            type: UserActions.SET_USER_SEEN_TUTORIAL
        };
    }
    static SET_PIN = 'SET_PIN'
    setPin(payload): Action {
        return {
            type: UserActions.SET_PIN,
            payload: payload
        }
    }
    static SET_PIN_SUCCESS = 'SET_PIN_SUCCESS'
    setPinSuccess(payload): Action {
        return {
            type: UserActions.SET_PIN_SUCCESS,
            payload: payload
        }
    }
    static VERIFY_PIN = 'VERIFY_PIN'
    verifyPin(payload): Action {
        return {
            type: UserActions.VERIFY_PIN,
            payload: payload
        }
    }
    static VERIFY_PIN_SUCCESS = 'VERIFY_PIN_SUCCESS'
    verifyPinSucces(payload): Action {
        return {
            type: UserActions.VERIFY_PIN_SUCCESS,
            payload: payload
        }
    }
    static VERIFY_PIN_FLAG_RESET = 'VERIFY_PIN_FLAG_RESET'
    verifyPinReset(): Action {
        return {
            type: UserActions.VERIFY_PIN_FLAG_RESET,
        }
    }
    static RESET_PIN = 'RESET_PIN'
    resetPin(payload): Action {
        return {
            type: UserActions.RESET_PIN,
            payload: payload
        }
    }
    static PLAN_DISARM = 'PLAN_DISARM'
    planDisarm(payload):Action{
        return{
            type: UserActions.PLAN_DISARM,
            payload: payload
        }
    }
    static CALL_MANAGER = 'CALL_MANAGER'
    callManager(payload): Action {
        return {
            type: UserActions.CALL_MANAGER,
            payload: payload
        }
    }
    static CALL_MANAGER_SUCCESS = 'CALL_MANAGER_SUCCESS'
    callManagerSucess(payload): Action {
        return {
            type: UserActions.CALL_MANAGER_SUCCESS,
            payload: payload
        }
    }
    static TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS';
    toggleNotification(payload): Action {
        return {
            type: UserActions.TOGGLE_NOTIFICATIONS,
            payload: payload
        }
    }
    static TOGGLE_NOTIFICATIONS_SUCCESS = 'TOGGLE_NOTIFICATIONS_SUCCESS'
    toggleNotificationSuccess(payload): Action {
        return {
            type: UserActions.TOGGLE_NOTIFICATIONS_SUCCESS,
            payload: payload
        }
    }

    static FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
    fetchNotification(payload): Action {
        return {
            type: UserActions.FETCH_NOTIFICATIONS,
            payload: payload
        }
    }

    static FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
    fetchNotificationSuccess(payload): Action {
        return {
            type: UserActions.FETCH_NOTIFICATIONS_SUCCESS,
            payload:payload
        }
    }

    static VIDEO_PLAY = 'VIDEO_PLAY';
    videoplay(payload:any): Action {
        return {
            type: UserActions.VIDEO_PLAY,
            payload: payload
        };
    }
    static SEND_DEVICE_TOKEN = 'SEND_DEVICE_TOKEN';
    sendDeviceToken(payload:any):Action {
        return {
            type: UserActions.SEND_DEVICE_TOKEN,
            payload: payload
        }
    }

    static BALANCE_DUE = 'BALANCE_DUE';
    balanceDue(payload: any): Action {
        return {
            type: UserActions.BALANCE_DUE,
            payload:payload
        }
    }
    static BALANCE_DUE_SUCCESS = 'BALANCE_DUE_SUCCESS';
    balanceDueSuccess(payload): Action {
        return {
            type: UserActions.BALANCE_DUE_SUCCESS,
            payload
        }
    }


    static UPDATE_HEADER_FLAG = 'UPDATE_HEADER_FLAG';
    updateHeaderFlag(payload): Action {
        return {
            type: UserActions.UPDATE_HEADER_FLAG,
            payload
        }
    }

    static SHOW_TUTORIAL_AGAIN = 'SHOW_TUTORIAL_AGAIN';
    showTutorialAgain(payload): Action {
        return {
            type: UserActions.SHOW_TUTORIAL_AGAIN,
            payload
        }
    }
    static GET_ALARM_TOKEN = 'GET_ALARM_TOKEN';
    getAlarmToken(payload): Action{
        return {
            type: UserActions.GET_ALARM_TOKEN,
            payload
        }
    }
    static GET_ALARM_LIST = 'GET_ALARM_LIST';
    getAlarmList(payload): Action{
        return {
            type: UserActions.GET_ALARM_LIST,
            payload
        }
    }

    static GET_ALARM_LIST_SUCCESS = 'GET_ALARM_LIST_SUCCESS';
    getAlarmListSuccess(payload): Action{
        return{
            type: UserActions.GET_ALARM_LIST_SUCCESS,
            payload
        }
    }

    static DELETE_ALARM = 'DELETE_ALARM';
    deleteAlarm(payload): Action{
        return{
            type: UserActions.DELETE_ALARM,
            payload
        }
    }

    static IS_OFFLINE = 'IS_OFFLINE';
    isOffline(payload): Action{
        return{
            type: UserActions.IS_OFFLINE,
            payload
        }
    }

    static NOTIFICATION_COUNT = 'NOTIFICATION_COUNT'; 
    notfificationCount(): Action{
        return{
            type: UserActions.NOTIFICATION_COUNT
        }
    }
    static NOTIFICATION_COUNT_SUCCESS = 'NOTIFICATION_COUNT_SUCCESS'; 
    notfificationCountSuccess(payload): Action{
        return{
            type: UserActions.NOTIFICATION_COUNT_SUCCESS,
            payload
        }
    }







    // static DIS_ARM_CAMERA = 'DIS_ARM_CAMERA';
    // disarmCamera(disarmCamera: any): Action {
    //     return {
    //         type: UserActions.DIS_ARM_CAMERA,
    //         payload: disarmCamera
    //     };
    // }
}