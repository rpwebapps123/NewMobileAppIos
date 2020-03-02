import { Action, ActionReducer } from '@ngrx/store';
import { StatsActions } from '../actions';
import { UserActions } from '../actions/user.actions';
import { EventLogData, EventLogList, LoginData, TicketList, User } from '../models/user';

export interface IUserState {
    siteTime: string;
    armStatusVal: any;
    userData: LoginData;
    current: User;
    IsLoggedin: boolean;
    ErrorMessage: string;
    armCamera: boolean;
    serviewArmCamerea: boolean;
    potentialListActive: boolean;
    cameraListActive: boolean;
    armDisArmInfo: any;
    MonitoringStatusData: any;
    authToken: string;
    hasSeenTutorial: boolean;
    isPinVerified:boolean;
    callManager: Array<any>;
    notifications: Array<any>;
    balanceDue:any;
    hideHeaderFlag:boolean;
    showTutorialAgain:boolean;
    alarmList:any;
    isOffline:boolean;
    notfificationCountSuccess:any;
    ticketsList: Array<TicketList>;
    eventLogData: EventLogData;
    isSwitchToTickets : false;
    eventlogDetail : EventLogList;
    onlineText : string;
    onlineStatus : number;
    currentStatsList: any;
    historyStatsList: any;
    clipsStatsList: any;
    liveRtmpStreamSuccess:any;
}
const initialState: IUserState = {
    userData: {
        hasMore: '',
        pageNo: '',
        userName: '',
        userType: '',
        potentialList: [],
        hasPin: false,
        siteTime: '',
        timeZone :'',
        disableNotification: false,
        provigilUserData: {},
    },
    current: {
        _id: '',
        Name: '',
        Mobile: 0,
        LoginType: '',
        IsLoggedin: false,
        statedata: '',
        status: true,
        LoggedInDate: new Date()
    },
    IsLoggedin: false,
    ErrorMessage: '',
    armCamera: false,
    serviewArmCamerea: false,
    potentialListActive: false,
    cameraListActive: false,
    armDisArmInfo: {},
    MonitoringStatusData : {},
    authToken: '',
    hasSeenTutorial: false,
    isPinVerified:false,
    callManager: [],
    notifications: [],
    balanceDue:{},
    hideHeaderFlag:false,
    alarmList: [],
    isOffline: false,
    showTutorialAgain:false,
    notfificationCountSuccess:{},
    ticketsList: [],
    eventLogData: {"isAllItemsLoaded":false,"eventLogList":[],"pageNo":0,"eventLogIvigilList":[]},
    isSwitchToTickets: false,
    armStatusVal:'',
    eventlogDetail : {},
    onlineText: '',
    onlineStatus: 2,
    siteTime: '',
    currentStatsList: {},
    historyStatsList: {},
    clipsStatsList: [],    
    liveRtmpStreamSuccess:'',
}
export const UsersReducer: ActionReducer<IUserState> =
    (state: IUserState = initialState, action: Action) => {
        console.log("******************** LOGIN-LOG-9.0 ************************ user.reducer.ts inside bEFORE LOGIN_SUCCESS action action.type"+action.type);
        switch (action.type) {
            case UserActions.LOGIN_SUCCESS:
                console.log('its comes into the reducer');
                return Object.assign({}, state, {
                    IsLoggedin: true,
                    // armCamera: false,
                    userData: action.payload
                });
            
            case UserActions.LOGOUT: {
                state = initialState;
                return state;
            }
           
            case UserActions.SAVE_ARM_DISARM_STATUS_INFO: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.armDisArmInfo = action.payload.armDisArmHistory;
                newState.MonitoringStatusData = action.payload.monitoringstatus;
                return newState;
            }
            case UserActions.SAVE_CAMERA_STATUS_INFO: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.onlineText = action.payload.onlineText;
                newState.onlineStatus = action.payload.onlineStatus;
                return newState;
            }
            case UserActions.GET_ARM_STATE_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.armCamera = (Number(action.payload.status) === 0 || Number(action.payload.status) === 4) ? true : false;
                return newState;
            }
            case UserActions.GET_SITE_TIME_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.siteTime = action.payload.serverTime;
                return newState;
            }
            case UserActions.SURVIEW_ARM_STATE_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.serviewArmCamerea = (Number(action.payload.status) === 0 || Number(action.payload.status) === 4) ? true : false;
                return newState;
            }
            case UserActions.SERVIEW_ARM_CAMERA_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.armCamera = true;
                return newState;
            }
            case UserActions.SERVIEW_DISARM_ARM_CAMERA_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.armCamera = false;
                return newState;
            }
            case UserActions.POTENTIAL_LIST_ACTIVE: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.potentialListActive = true;
                return newState;
            }
            case UserActions.POTENTIAL_LIST_INACTIVE: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.potentialListActive = false;
                return newState;
            }
            case UserActions.CAMERA_LIST_ACTIVE: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.cameraListActive = true;
                return newState;
            }

            case UserActions.CAMERA_LIST_INACTIVE: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.cameraListActive = false;
                return newState;
            }
            case UserActions.SET_USER_SEEN_TUTORIAL: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.hasSeenTutorial = true;
                newState.showTutorialAgain = false;
                return newState;
            }
            case UserActions.SET_PIN_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.userData.hasPin = true;
                return newState;
            }
            case UserActions.VERIFY_PIN_SUCCESS:{
                var newState = JSON.parse(JSON.stringify(state));
                newState.isPinVerified = true;
                return newState;
            }
            case UserActions.VERIFY_PIN_FLAG_RESET:{
                var newState = JSON.parse(JSON.stringify(state));
                newState.isPinVerified = false;
                return newState;
            }
            case UserActions.CALL_MANAGER_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.callManager = action.payload;
                return newState;
            }
            case UserActions.FETCH_NOTIFICATIONS_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.notifications = action.payload.data;
                return newState;
            }
            case UserActions.BALANCE_DUE_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.balanceDue = action.payload;
                return newState;
            }
            case UserActions.TOGGLE_NOTIFICATIONS_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.userData.disableNotification = action.payload;
                return newState;
            }
            case UserActions.SHOW_TUTORIAL_AGAIN:{
                var newState = JSON.parse(JSON.stringify(state));
                newState.showTutorialAgain = action.payload;
                return newState;
            }
            case UserActions.GET_ALARM_LIST_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                console.log('chari-data', action.payload.events);
                if( action.payload.events !== undefined){
                    newState.alarmList = action.payload.events.filter((item)=>{
                        return item.PSA_Cancelled__c === false ?  true : false;
                    });
                    newState.alarmList.sort((a,b) => a.StartDateTime.toString().localeCompare(b.StartDateTime));
                } else {
                    newState.alarmList = action.payload.events;
                }
               // newState.alarmList = action.payload.events;
                return newState;
            }
            case UserActions.IS_OFFLINE: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.isOffline = action.payload;
                return newState;
            }
            case UserActions.NOTIFICATION_COUNT_SUCCESS: {
                var newState = JSON.parse(JSON.stringify(state));
                newState.notfificationCountSuccess = action.payload;
                return newState;
            }
            case UserActions.SET_TICKET_DATA:{
            return Object.assign({}, state, {
                ticketsList: action.payload
            });
            }
            case UserActions.SET_EVENTLOG_DATA: {
                 var newState = JSON.parse(JSON.stringify(state));
                newState.eventLogData.isAllItemsLoaded = action.payload.isAllItemsLoaded;
                newState.eventLogData.pageNo = action.payload.pageNo;
                if(window.localStorage.isPvmUser === 'true') {
                    newState.eventLogData.eventLogList = action.payload.recentEscalations;
                } else {
                    newState.eventLogData.eventLogIvigilList = action.payload.recentEscalations;
                }
                return newState;
            }
         case UserActions.SET_EVENTLOGVIDEO_DATA:{
            var newState = JSON.parse(JSON.stringify(state));
            newState.eventLogVideoData =  action.payload;
            return newState;
            }
            case UserActions.SET_TICKET_ERROR_DATA:{
                return Object.assign({}, state, {
                    ErrorMessage: action.payload
                });
                }
            case UserActions.SET_LIST_TICKET:{
            return Object.assign({}, state, {
                isSwitchToTickets : true
            });
           }
        case StatsActions.CURRENT_STATS_LIST_SUCCESS: {
            var newState = JSON.parse(JSON.stringify(state));
            newState.currentStatsList = action.payload.SiteStatistics;
            return newState;
        }
        case StatsActions.HISTORY_STATS_LIST_SUCCESS: {
            var newState = JSON.parse(JSON.stringify(state));
            newState.historyStatsList = action.payload.SiteStatistics;
            return newState;
        }
        case StatsActions.CLIPS_STATS_LIST_SUCCESS: {
            var newState = JSON.parse(JSON.stringify(state));
            newState.clipsStatsList = action.payload.clips;
            return newState;
        }
        case UserActions.LIVE_RTMP_STREM_SUCCESS: {
            var newState = JSON.parse(JSON.stringify(state));
            newState.liveRtmpStreamSuccess = action.payload.live_streaming;
            return newState;
        }
            default:
                return state;
        };
    };


