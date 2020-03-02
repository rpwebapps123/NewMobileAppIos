import { Pages } from "../actions/navigation.actions";
// var PvmIvigilProvigil = "{{base_url}}/api/gateway"

export const isDev = false;//false for Prod

/*********** Urls **************/
     /**
    * For pvm user  base urls start here
     */
    var basePvmUrl = isDev ? "http://54.161.137.77:9100" : "http://54.175.158.209:9100";
    var newbasePvmUrl =  isDev ? "http://development-vigil-x.pro-vigil.com:8080/vigilx-mobileapi" : "https://monitoring.pro-vigil.com:8443/vigilx-mobileapi";
    var statsbasePvmUrl =  isDev ? "http://testing-vigil-x.pro-vigil.com:8080/vgsservices/sitedetails" : "https://monitoring.pro-vigil.com:8443/vigilx-mobileapi";
      //  var newbasePvmUrl =  "http://192.168.1.174:8080/vigilx-mobileapi";//comment for Prod ******************
    var mobilePvmServerUrl = isDev ? "http://development-vigil-x.pro-vigil.com:8080" : "http://testing-vigil-x.pro-vigil.com:8080";
   //   var mobilePvmServerUrl =  "http://192.168.1.174:8080";//comment for Prod ******************
    var PvmProvigil = basePvmUrl + "/api/gateway";
    var RTMPUrlIvigil='http://uat-1.pro-vigil.info:8080/pro-vigil';
   /**
    * For pvm user  base urls ends here
    */
    /**
     * For i vigil user  base urls start here
     */
    var baseIvigilUrl = isDev ? "http://54.161.137.77:9100" : "http://54.175.158.209:9100";
    var newbaseIvigilUrl =  isDev ? "http://testworkspace.pro-vigil.com:777/ivigil-shield/2.0/mobile" : "https://workspace.pro-vigil.info:8443/ivigil-shield/2.0/mobile";
    var statsbaseIvigilUrl =  isDev ? "http://testworkspace.pro-vigil.com:777/ivigil-workspace/mobile" : "https://workspace.pro-vigil.info:8443/ivigil-workspace/mobile";
    var mobileIvigilServerUrl = isDev ? "http://testconsole1.pro-vigil.com:8080/ivigil-console" : "https://console-vigilx.pro-vigil.com:8443/ivigil-console";
    var ivigilLoginUrlProd= "https://workspace.pro-vigil.info:8443/ivigil-shield/MobileHttpsUrlServlet";
    var IvigilProvigil = baseIvigilUrl + "/api/gateway";
    /**
     * For i vigil user  base url  ends here
     */
    var salesForceBaseUrl = isDev?"http://test-monitoring.pro-vigil.com:8090/vigilx-salesforce":"http://ivigil-cg.pro-vigil.com:8080/vigilx-salesforce"; 
    var netAnalyticsUrl =  isDev ? "https://stagingpro-vigil.my-netalytics.com/datahandler/api/netalytics_direct/dummy" : "https://monitoring.pro-vigil.com:8443/vigilx-mobileapi";//"https://monitoring.pro-vigil.com:8443/vigilx-mobileapi"//"https://pro-vigil.my-netalytics.com/datahandler/api/netalytics_direct/dummy";
    var mobileTicketUrl = isDev?"https://ticketing-test.pro-vigil.com/development":"https://ticketing.pro-vigil.com";
//export const isDesktop = true;//false for mobile Prod
export const isDesktop = false;//false for mobile Prod
const AppConfig = {
    isScreenLock : true,//true for Prod
    preloadModules: true,
    pvmServiceRequests: {
        // validateUserByMobileNumber: (isDesktop ? '' : API_BASE_URL) + '/user/verifymobile/',
        ImageUrl: 'cameraUrl' + 'SnapShot?' + 'channel=CameraId&station=recordingStation',
        armDisArmInfo: PvmProvigil,
        // signup: (!isDesktop ? '' : API_BASE_URL) + '/user/signup',
        loginUser: newbasePvmUrl + '/api/auth/login',
      //  setPin: basePvmUrl + '/api/auth/pin',
      //  resetPin: basePvmUrl + '/api/auth/pin/forgot',
        state: PvmProvigil,
        //armCamera: PvmProvigil,
        surviewArmState: PvmProvigil,
        surviewArmCamera: PvmProvigil,
        surviewDisArmCamera: PvmProvigil,
        fetchArmStatus: PvmProvigil,
        camerasList: PvmProvigil,
        getVedios: PvmProvigil,
        monitoring: PvmProvigil,
        monitoringstatus: PvmProvigil,
        monitoringunit: PvmProvigil,
        events: PvmProvigil + 'wsdl',
        // ManageAlarm: 'http://127.0.0.1:9999/api/v1/mangeAlarms',
        // sureviewCamerasList: 'http://workspace.pro-vigil.com:777/ivigil-shield//2.0/mobile',
        sureviewCamerasList: PvmProvigil,
        chatBoxUrl: 'https://home-c15.incontact.com/inContact/ChatClient/ChatClientPatron.aspx?poc=3c9870e1-977b-4dde-8cc6-b96bd47426ab&bu=4595221',
        aboutUsUrl: 'https://pro-vigil.com/company/',
        planDisarm: basePvmUrl + '/api/salesforce',
        psaService : newbasePvmUrl + '/PSAService/',
        videoplay: PvmProvigil,
        balanceDue: basePvmUrl + '/api/salesforce',
        getLiveUrl: PvmProvigil,
        // validateUserByMobileNumber: (isDesktop ? '' : API_BASE_URL) + '/user/verifymobile/',
        gatewayTargetUriImageUrl: PvmProvigil + 'channel=CameraId&station=recordingStation',
        gatewayTargetUriArmDisArmInfo: PvmProvigil,
        // signup: (!isDesktop ? '' : API_BASE_URL) + '/user/signup',
        gatewayTargetUriState: PvmProvigil,
        gatewayTargetArmState: PvmProvigil,
        gatewayTargetUriArmCamera: PvmProvigil,
        gatewayTargetUriSurviewArmState: PvmProvigil,
        gatewayTargetUriSurviewArmCamera: PvmProvigil,
        gatewayTargetUriSurviewDisArmCamera: PvmProvigil,
        gatewayTargetUriFetchArmStatus: PvmProvigil,
        gatewayTargetUriCamerasList: PvmProvigil,
        gatewayTargetUriGetVedios: PvmProvigil,
        gatewayTargetUriMonitoring: PvmProvigil,
        gatewayTargetUriMonitoringstatus: PvmProvigil,
        gatewayTargetUriMonitoringunit: PvmProvigil,
        gatewayTargetUriVideoplay: PvmProvigil,
        gatewayTargetUriEvents: PvmProvigil + 'wsdl',
        gatewayTargetUriStats: PvmProvigil + 'action=STATS&potentialid=95103&device=asd&date=2015-08',
        // ManageAlarm: 'http://127.0.0.1:9999/api/v1/mangeAlarms',
        gatewayTargetUriSureviewCamerasList: PvmProvigil,
        gatewayTargetUriChatBoxUrl: PvmProvigil + 'poc=3c9870e1-977b-4dde-8cc6-b96bd47426ab&bu=4595221',
        gatewayTargetUriplanDisarm: '',
//        verifyPin: basePvmUrl + '/api/auth/pin/verify',
        createTicket : mobileTicketUrl + '/webservices/ws/createTicket',
        ticketsList :  mobileTicketUrl + '/webservices/ws/getTicketList',
        eventLog :  mobilePvmServerUrl + '/vigilx-mobileapi/recentEscalationsByPageAPI.do',//Uncomment for Prod ******************
        eventLogVideo :  mobilePvmServerUrl + '/vigilx-mobileapi/recentReportsByPageAPI.do',//Uncomment for Prod ******************
    //     eventLog :  mobilePvmServerUrl + '/vgs-monitoring/recentEscalationsByPageAPI.do',//comment for Prod ******************
    //     eventLogVideo :  mobilePvmServerUrl + '/vgs-monitoring/getuccreportlistByPage.do',//comment for Prod ******************
    //       eventLog :  newbasePvmUrl + '/recentEscalationsByPageAPI.do',//comment for Prod ******************
    //      eventLogVideo :  newbasePvmUrl + '/getuccreportlistByPage.do',//comment for Prod ******************
         deviceLogData :  newbasePvmUrl + '/savedeviceLogData.do',//comment for Prod ******************
         Ticketing: basePvmUrl + '/api/salesforce',
        //toggleNotifications: basePvmUrl + '/api/auth/user/notification',
        sendDeviceToken: basePvmUrl + '/api/auth/user/device',
        updatePotential: basePvmUrl + '/api/auth/user/site',
        getActivePotential: basePvmUrl + '/api/auth/user/site',
        notfificationCount: basePvmUrl + '/api/auth/user/unread/notifications',
        ArmDisarmHistoryDirect : newbasePvmUrl + '/ArmDisarmHistory',
        ArmDisarmStausHistoryDirect : newbasePvmUrl + '/ArmDisarmStausHistory',
        CamerasStatusDirect : newbasePvmUrl + '/CamerasStatus',
        MonitoringHours : newbasePvmUrl + '/getmonitoringhours',
        MonitoringStatus : newbasePvmUrl + '/monitoringstatus',
        CamioCameralist : newbasePvmUrl + '/camiocameralist',
        NetAnalyticsCameralist : netAnalyticsUrl + '/getCamioDevicesStatus',
        setPin: newbasePvmUrl + '/api/auth/pin',
        resetPin: newbasePvmUrl + '/api/auth/pin/forgot',
        verifyPin: newbasePvmUrl + '/api/auth/pin/verify',
        armCamera: newbasePvmUrl + '/armdisarm',
        toggleNotifications: newbasePvmUrl + '/api/auth/user/notification',
        serverTime: newbasePvmUrl + '/api/SiteTime',
        siteStatus: newbasePvmUrl + '/monitoringstatus',
        stats: statsbasePvmUrl + '/getsitestatistics',
        RTMPUrl:RTMPUrlIvigil+'/getlivestreamingurl',
        //ArmDisarmHistory?fdate=5/27/2019&tdate=5/29/2019&sitename=Aloha%20Alarm%20of%20Aiea%20-%20Kalakaua%20Plaza%20F1016&event=MonitoringStatus&potentialid=a1Y1J000004QTwDUAW
    },
    ivigilServiceRequests: {
        ImageUrl: 'cameraUrl' + 'SnapShot?' + 'channel=CameraId&station=recordingStation',
        armDisArmInfo: IvigilProvigil,
        loginUser: isDev ? newbaseIvigilUrl : ivigilLoginUrlProd ,
        state: IvigilProvigil,
        surviewArmState: IvigilProvigil,
        surviewArmCamera: IvigilProvigil,
        surviewDisArmCamera: IvigilProvigil,
        fetchArmStatus: IvigilProvigil,
        camerasList: IvigilProvigil,
        getVedios: IvigilProvigil,
        monitoring: IvigilProvigil,
        monitoringstatus: IvigilProvigil,
        monitoringunit: IvigilProvigil,
        events: IvigilProvigil + 'wsdl',
        sureviewCamerasList: IvigilProvigil,
        chatBoxUrl: 'https://home-c15.incontact.com/inContact/ChatClient/ChatClientPatron.aspx?poc=3c9870e1-977b-4dde-8cc6-b96bd47426ab&bu=4595221',
        aboutUsUrl: 'https://pro-vigil.com/company/',
        planDisarm: baseIvigilUrl + '/api/salesforce',
        psaService : newbaseIvigilUrl + '/PSAService/',
        videoplay: IvigilProvigil,
        balanceDue: baseIvigilUrl + '/api/salesforce',
        getLiveUrl: IvigilProvigil,
        gatewayTargetUriImageUrl: IvigilProvigil + 'channel=CameraId&station=recordingStation',
        gatewayTargetUriArmDisArmInfo: IvigilProvigil,
        gatewayTargetUriState: IvigilProvigil,
        gatewayTargetArmState: IvigilProvigil,
        gatewayTargetUriArmCamera: IvigilProvigil,
        gatewayTargetUriSurviewArmState: IvigilProvigil,
        gatewayTargetUriSurviewArmCamera: IvigilProvigil,
        gatewayTargetUriSurviewDisArmCamera: IvigilProvigil,
        gatewayTargetUriFetchArmStatus: IvigilProvigil,
        gatewayTargetUriCamerasList: IvigilProvigil,
        gatewayTargetUriGetVedios: IvigilProvigil,
        gatewayTargetUriMonitoring: IvigilProvigil,
        gatewayTargetUriMonitoringstatus: IvigilProvigil,
        gatewayTargetUriMonitoringunit: IvigilProvigil,
        gatewayTargetUriVideoplay: IvigilProvigil,
        gatewayTargetUriEvents: IvigilProvigil + 'wsdl',
        gatewayTargetUriSureviewCamerasList: IvigilProvigil,
        gatewayTargetUriChatBoxUrl: IvigilProvigil + 'poc=3c9870e1-977b-4dde-8cc6-b96bd47426ab&bu=4595221',
        gatewayTargetUriplanDisarm: '',
        createTicket : mobileTicketUrl + '/webservices/ws/createTicket',
        ticketsList :  mobileTicketUrl + '/webservices/ws/getTicketList',
        eventLog :  mobileIvigilServerUrl + '/EventLog',//Uncomment for Prod ******************
        ArmDisarmHistoryDirect : mobileIvigilServerUrl + '/reverseEscallations',
        ArmDisarmStausHistoryDirect : mobileIvigilServerUrl + '/reverseEscallations',
        deviceLogData :  newbaseIvigilUrl + '/savedeviceLogData.do',//comment for Prod ******************
        Ticketing: baseIvigilUrl + '/api/salesforce',
        sendDeviceToken: baseIvigilUrl + '/api/auth/user/device',
        updatePotential: baseIvigilUrl + '/api/auth/user/site',
        getActivePotential: baseIvigilUrl + '/api/auth/user/site',
        notfificationCount: baseIvigilUrl + '/api/auth/user/unread/notifications',
        CamerasStatusDirect : newbaseIvigilUrl + '/CamerasStatus',
        MonitoringHours :  'getMonitoringHours',
        MonitoringStatus : newbaseIvigilUrl + '/monitoringstatus',
        CamioCameralist :  'ProvigilService',
        NetAnalyticsCameralist : netAnalyticsUrl + '/getCamioDevicesStatus',
        setPin: newbaseIvigilUrl + '/api/auth/pin',
        resetPin: newbaseIvigilUrl + '/api/auth/pin/forgot',
        verifyPin: newbaseIvigilUrl + '/api/auth/pin/verify',
        armCamera: mobileIvigilServerUrl + '/mobile',
        toggleNotifications: newbaseIvigilUrl + '/api/auth/user/notification',
        serverTime: newbaseIvigilUrl + '/api/SiteTime',
        siteStatus:  'CameraService',
        stats : statsbaseIvigilUrl,
        RTMPUrl:RTMPUrlIvigil+'/getlivestreamingurl',
    },
    salesForceMiddleWare: {
        authDetails: {
            grant_type: 'password',
            client_id: '3MVG9xOCXq4ID1uEpCSWAjJTe9ZSeV4INLNSl8v9VA0u3y5tMkD7PAyduDwMs9zu4bCBSTuc.GPmxihKT1SJq',
            client_secret: '2528928582978047281',
            username: 'integration.user@pro-vigil.com',
            password: 'NewStrategy18V7C79bdo5Wk7GxBJsKNalzUxd'
          },
          generateToken: salesForceBaseUrl + "/login",
         getPsaList: salesForceBaseUrl + "/listofpsa",
          createPsa: salesForceBaseUrl + "/createpsa",
          deletePsa: salesForceBaseUrl + "/deletepsa"

    },
    //pageTransition: 'md-transition',
    getActivePotential: basePvmUrl + '/api/auth/user/site',
    notfificationCount: basePvmUrl + '/api/auth/user/unread/notifications'
}


export interface IRequests {
    loginUser: string;
    camerasList: string;
}
export {
    AppConfig
}
export default [AppConfig];

