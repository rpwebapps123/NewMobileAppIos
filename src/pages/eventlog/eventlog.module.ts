import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventLogPage } from './eventlog';
 

@NgModule({
  declarations: [
    EventLogPage,
  ],
  imports: [
    IonicPageModule.forChild(EventLogPage),
  ],
})
export class EventLogPageModule {}
