import { SitesActions } from './../actions/sites.action';
import { NgModule, ErrorHandler } from '@angular/core';
import { isDesktop } from './../config/appConfig';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyAppDesktop } from './app_desktop.component';


import 'rxjs';
import { Network } from '@ionic-native/network';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule,NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import reducer from '../reducers';


import { LoadingIndicator } from '../components/loadingIndicator/loadingIndicator';
import { StatsCurrentDataComponent } from './../components/stats-current-data/stats-current-data';
import { StatsVideoDataComponent } from './../components/stats-video-data/stats-video-data';
import { UserActions, NavigationActions, PotentialActions, CameraActions, MonitorActions, VideoActions, StatsActions, EventsActions, EventListAction ,CameraHealthActions, ArmStatusActions } from '../actions';
import { UserEffects, NavigationEffects, CameraEffects, EventsEffects, StatsEffects, CameraHealthEffects } from '../effects';
import { HeaderPage } from '../components/header/header';
import { UserService, LoadingService, MainService, CameraService, EventsService, StatsService } from '../services';
import {
  HomePage, UserPhonePage, CreateAccount, Login,
  ArmDisarmInfo, MonitorPage, VideoPage, CameraPage, CameraListMenu,
  PotentialListMenu, PlayVideo, SettingsPage, AboutUsPage, PinPage, TicketingPage, EventListPage,
  Alarms, SetupPinPage, NotificationsPage,BalanceDuePage,CameraHealthListMenu,AboutusPage,CameraHdViewPage,EventLogPage, EventlogDetailPage, SitesListPage } from '../pages';
import { VideoPlayer } from '@ionic-native/video-player';
import { VideoEditor } from '@ionic-native/video-editor';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { AppConfig } from '../config/appConfig';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Camera } from '@ionic-native/camera';
import { PincodeInputModule } from 'ionic2-pincode-input';
import { ZoomAreaCustomModule } from './../components/zoom-area-custom';
import { Device } from '@ionic-native/device';
import { CallNumber } from '@ionic-native/call-number';
//import { Push } from '@ionic-native/push';
//import { PhotoLibrary } from '@ionic-native/photo-library';
import moment from 'moment';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { Splash } from '../pages/splash/splash';
import { TimeZonePipe } from '../pages/ticketing/timezoneformat.pipe';
import { LongPressDirective } from '../pages/home/longpress.directive';
import { PopupPage } from '../pages/popup/popup';
import { Globals } from '../config/globals';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { StatsPageModule } from '../pages/stats/stats.module';
import { MaskingPageModule } from '../pages/masking/masking.module';
import { VideoPopupPage } from '../pages/videoPopup/videoPopup';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { LocalNotifications } from '@ionic-native/local-notifications';

const EntryFile = isDesktop ? MyApp : MyApp;
export const COMPONENTS = [
  EntryFile,
  Login,
  MyApp,
  HomePage,
   UserPhonePage,
   LoadingIndicator,
  CreateAccount,
  ArmDisarmInfo,
  EventListPage,
  VideoPage,
  CameraPage,
  PotentialListMenu,
  PlayVideo,
  SettingsPage,
  AboutUsPage,
  MonitorPage,
  CameraListMenu,
  PinPage,
   HeaderPage,
  StatsCurrentDataComponent,
  StatsVideoDataComponent,
  TicketingPage,
  Alarms,
  SetupPinPage,
  NotificationsPage,
  BalanceDuePage,
  CameraHealthListMenu,
  AboutusPage,
  CameraHdViewPage,
  EventLogPage,
  EventlogDetailPage,
  PopupPage,
  SitesListPage,
  VideoPopupPage
  //,
   //Splash
];

let COMPONENTSARRAY = [];

COMPONENTSARRAY = COMPONENTSARRAY.concat(COMPONENTS);
COMPONENTSARRAY = COMPONENTSARRAY.concat(TimeZonePipe);
COMPONENTSARRAY = COMPONENTSARRAY.concat(LongPressDirective);

@NgModule({
  declarations: COMPONENTSARRAY,
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    PincodeInputModule,
    StatsPageModule,
    MaskingPageModule,
    NgIdleKeepaliveModule,
    IonicModule.forRoot(EntryFile, AppConfig),
    StoreModule.provideStore(reducer),
    EffectsModule.run(UserEffects),
    EffectsModule.run(NavigationEffects),
    EffectsModule.run(CameraEffects),
    EffectsModule.run(EventsEffects),
    EffectsModule.run(StatsEffects),
    EffectsModule.run(CameraHealthEffects),
    ZoomAreaCustomModule.forRoot(),
    PinchZoomModule

  ],
  providers: [
    //PhotoLibrary,Push
    SplashScreen, StatusBar, Network, VideoPlayer, Camera, VideoEditor, Device,CallNumber, 
    FileTransfer, FileTransferObject, File, AndroidPermissions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserActions, NavigationActions, PotentialActions, CameraActions,
    MonitorActions, VideoActions, EventsActions, StatsActions, StatsService, ArmStatusActions,
    UserService, MainService, CameraService, EventsService, LoadingService, VideoActions, StreamingMedia, EventListAction, EventsActions, CameraHealthActions
  , ScreenOrientation, Globals, InAppBrowser, SitesActions, AppVersion, LocalNotifications
  ],
  bootstrap: [IonicApp],
  entryComponents: COMPONENTS
})
export class AppModule { }
