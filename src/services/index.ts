import { HttpModule } from '@angular/http';
import { CameraService } from './camera.service';
import { EventsService } from './events.service';
import { LoadingService } from './loader.service';
import { MainService } from './main.service';
import { StatsService } from './stats.service';
import { UserService } from './user.service';


export { UserService, LoadingService, CameraService, EventsService, MainService, StatsService };

export default [
    HttpModule,
    UserService,
    LoadingService,
    CameraService,
    MainService,
    EventsService,
    StatsService
];