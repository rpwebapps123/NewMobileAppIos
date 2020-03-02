export interface User {
    _id: string;
    Name: string;
    Mobile: number;
    LoginType: string;
    IsLoggedin: boolean;
    LoggedInDate: Date;
    statedata: any;
    status: any;
}

export class SignupDetails {
    password: string;
    firstName: string;
    lastName: string;
    street: string;
    number: string;
    city: string;
    zipcode: string;
    country: string;
}

export interface LoginData {
    hasMore: string;
    pageNo: string;
    userName: string;
    userType: string;
    potentialList: Array<PotentialList>;
    hasPin: boolean;
    siteTime: string;
    timeZone: string;
    disableNotification: boolean;
    provigilUserData: any;
}

export interface PotentialList {
    accountId: string;
    groupid: number;
    installationId: string;
    numberOfCameras: number;
    potentialId: string;
    siteName: string;
    surview: boolean;
    unitId: string;
    url: string;
    sfaccountId: string;
    timezone: string;
}
export class stateDetails {
    id: string;
    date: string;
    Name: string;
    street: string;
    number: string;
    city: string;
    zipcode: string;
    country: string;
}
export class eventList {
    startDate: string;
    endDate: string;
}
// tslint:disable-next-line:interface-name
export interface CameraList {
    CameraId?: string;
    Name?: string;
    description?: string;
    PTZ?: boolean;
    TimelapseArchiveEnabled?: boolean;
    connected?: string;
    sdUrl?: string;
    hdUrl?: string;
    imgurl?: string;
    imageData?: string;
    name?: string;  //for i-vigil
    analyticId?: number; //for i-vigil
    hdurl?: string;  //for i-vigil
    cameraId?: string; //for i-vigil
    dayImg?: string; //for i-vigil
}

export interface TicketList {
    ticket_id?: string;
    ticket_number?: string;
    description?: string;
    account_name?: string;
    los?: string;
    created_on?: string;
    status?: string;    
    isviewmore?: boolean;
}

export interface EventLogData {
    pageNo: number;
    isAllItemsLoaded: boolean;
   // eventLogList: Array<EventLogList>;
    eventLogList: Array<EventLogList>;
    eventLogIvigilList: Array<EventLogIvigilList>;
}

export interface EventLogList {
    eventid	?:string
    eventurl	?:string
    notes	?:string
    tagid	?:string
    rolename	?:string
    timezone	?:string
    groupID	?:string
    endtime	?:string
    starttime	?:string
    cameraname	?:string
    duration	?:string
    tagname	?:string
    name	?:string
    fullname	?:string
    installationid	?:string

}
export interface EventLogIvigilList {
    idx	?: string;  //eventid
    eventTimeStr	?: string; //starttime
    eventlink	?: string; //eventurl
    actionType	?: string; //tagname
    actionNotes	?: string; //notes
    cameraName	?: string; //cameraName
    facilityId ?: string;
}

export class MonitoringDetails {
    MonitoringHours: string;
    AdditionalMonitoringHours: string;
}
export class MonitoringStatusDetails {
    status: string;
    serverTime: number;
}
export class MonitoringUnitDetails {
    status: number;
    Unit: string;
    Duration: number;
}
export interface VideoList {
    eventid: string;
    clipUrl: any;
    eventTime: any;
    thumbnailUrl: any;
    title: string;
}
